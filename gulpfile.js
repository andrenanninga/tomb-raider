'use strict';

var _                = require('underscore');
var path             = require('path');
var savePixels       = require('save-pixels');
var source           = require('vinyl-source-stream');
var runSequence      = require('run-sequence');
var gulp             = require('gulp');
var clean            = require('gulp-clean');
var connect          = require('gulp-connect');
var file             = require('gulp-file');
var plumber          = require('gulp-plumber');
var browserify       = require('gulp-browserify');
var ghPages          = require('gulp-gh-pages');

var loaderTextiles16 = require('./src/loader/textiles16');
var loaderLevel      = require('./src/loader/level');

var levelNames = [
  // 'assault',
  // 'boat',
  // 'catacomb',
  // 'deck',
  // 'emprtomb',
  // 'floating',
  'house',
  // 'icecave',
  // 'keel',
  // 'living',
  // 'monastry',
  // 'opera',
  // 'platform',
  // 'rig',
  // 'skidoo',
  // 'unwater',
  // 'venice',
  // 'wall',
  // 'xian'
];

gulp.task('webserver', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('watch-mesh', ['webserver', 'build-mesh'], function() {
  gulp.watch('src/**/*.*', ['build-mesh']);
});

gulp.task('build-mesh', function() { 
  gulp.src('./src/mesh/index.html')
    .pipe(plumber())
    .pipe(gulp.dest('./build/mesh'));

  gulp.src('./src/mesh/index.js')
    .pipe(plumber())
    .pipe(browserify())
    .pipe(gulp.dest('./build/mesh'))
    .pipe(connect.reload());
});

gulp.task('watch-app', ['webserver', 'build-app'], function() {
  gulp.watch('src/**/*.*', ['build-app']);
});

gulp.task('build-app', function() { 
  gulp.src('./src/app/index.html')
    .pipe(plumber())
    .pipe(gulp.dest('./build/app'));

  gulp.src('./src/app/index.js')
    .pipe(plumber())
    .pipe(browserify())
    .pipe(gulp.dest('./build/app'))
    .pipe(connect.reload());
});

gulp.task('build-levels', function(cb) {
  runSequence(
    'build-levels:clean',
    ['build-levels:level', 'build-levels:textiles16'],
    cb
  );
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
      cb(err);
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
        afterLevelLoad(err);
      }

      file('level.json', JSON.stringify(level), { src: true })
        .pipe(gulp.dest('./build/levels/' + levelName));

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

      afterTextilesLoad();
    });
  });
});