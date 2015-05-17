'use strict';

var _                = require('underscore');
var path             = require('path');
var savePixels       = require('save-pixels');
var source           = require('vinyl-source-stream');
var runSequence      = require('run-sequence');
var gulp             = require('gulp');
var clean            = require('gulp-clean');
var connect          = require('gulp-connect');
var gutil            = require('gulp-util');
var file             = require('gulp-file');
var plumber          = require('gulp-plumber');
var browserify       = require('gulp-browserify');
var ghPages          = require('gulp-gh-pages');

var loaderTextiles16 = require('./src/loader/textiles16');
var loaderLevel      = require('./src/loader/level');
var loaderAudio      = require('./src/loader/audio');

var levelNames = [
  'assault',
  'boat',
  'catacomb',
  'deck',
  'emprtomb',
  'floating',
  'house',
  'icecave',
  'keel',
  'living',
  'monastry',
  'opera',
  'platform',
  'rig',
  'skidoo',
  'unwater',
  'venice',
  'wall',
  'xian'
];

gulp.task('webserver', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('clean', function() {
  return gulp.src('./build', { read: false })
    .pipe(clean());
});

gulp.task('build-levels', function(cb) {
  runSequence('build-levels:clean', ['build-levels:level', 'build-levels:textiles16'], cb);
});

gulp.task('build-levels:clean', function() {
  var paths = _.map(levelNames, function(levelName) {
    return  './build/levels/' + levelName;
  });

  return gulp.src(paths, { read: false })
    .pipe(clean());
});

gulp.task('build-levels:level', function(cb) {
  var numLevels = levelNames.length;
  var loadedLevels = 0;
  var afterLevelLoad = function(err) {
    if(err) {
      return cb(err);
    }

    loadedLevels += 1;
    if(loadedLevels === numLevels) {
      cb();
    }
  };

  _.each(levelNames, function(levelName) {
    var path = './data/' + levelName.toUpperCase() + '.TR2';

    loaderLevel(path, function(err, level) {
      if(err) {
        return afterLevelLoad(err);
      }

      file('level.json', JSON.stringify(level), { src: true })
        .pipe(gulp.dest('./build/levels/' + levelName));

      gutil.log('finished build-levels:level - ' + levelName);
      afterLevelLoad();
    });
  });
});

gulp.task('build-levels:textiles16', function(cb) {
  var numLevels = levelNames.length;
  var loadedLevels = 0;
  var afterTextilesLoad = function(err) {
    if(err) {
      return cb(err);
    }

    loadedLevels += 1;
    if(loadedLevels === numLevels) {
      cb();
    }
  };

  _.each(levelNames, function(levelName) {
    var path = './data/' + levelName.toUpperCase() + '.TR2';

    loaderTextiles16(path, function(err, images) {
      if(err) {
        return afterTextilesLoad(err);
      }

      _.each(images, function(image, i) {
        savePixels(image, 'png')
          .pipe(source('textile16_' + i + '.png'))
          .pipe(gulp.dest('./build/levels/' + levelName + '/textiles'));
      });

      gutil.log('finished build-levels:textiles16 - ' + levelName);
      afterTextilesLoad();
    });
  });
});

gulp.task('build-audio', function(cb) {
  var path = './data/MAIN.SFX';

  loaderAudio(path, function(err, audio) {
    if(err) {
      return cb(err);
    }

    _.each(audio, function(clip, i) {
      file(i + '.wav', clip, { src: true })
        .pipe(gulp.dest('./build/audio'));
    });

    cb();
  });
});

gulp.task('build-js', function() {
  return gulp.src('./src/app/*.js')
    .pipe(plumber())
    .pipe(browserify())
    .pipe(gulp.dest('./build'));
});

gulp.task('build-html', function() {
  return gulp.src('./src/app/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('./build'));
});

gulp.task('reload', function() {
  return gulp.src('build/*.*')
    .pipe(plumber())
    .pipe(connect.reload());
});

gulp.task('watch', ['webserver', 'build'], function() {
  return gulp.watch('src/**/*.*', ['build']);
});

gulp.task('build', function(callback) {
  runSequence(
    'build-js',
    'build-html',
    'reload',
    callback
  );
});

gulp.task('deploy', ['deploy:prepare'], function() {
  return gulp.src('./build/**/*.*')
    .pipe(ghPages());
});

gulp.task('deploy:prepare', function(cb) {
  runSequence('clean', 
    ['build-js', 'build-html', 'build-levels', 'build-audio'], 
  cb);
});