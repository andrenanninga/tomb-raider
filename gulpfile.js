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

var loaderTextiles16 = require('./src/loader/textiles16');
var loaderLevel      = require('./src/loader/level');

gulp.task('webserver', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('watch-mesh', ['webserver', 'build-mesh'], function() {
  gulp.watch('src/mesh/*.*', ['build-mesh']);
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

gulp.task('build-house', function(cb) {
  return runSequence(
    'build-house:clean',
    ['build-house:level', 'build-house:textiles16'],
    cb
  );
});

gulp.task('build-house:clean', function() {
  return gulp.src('./build/levels/house', { read: false })
    .pipe(clean());
});

gulp.task('build-house:textiles16', function(cb) {
  var levelPath = path.resolve('./data/HOUSE.TR2');

  loaderTextiles16(levelPath, function(err, images) {
    if(err) {
      return cb(err);
    }

    _.each(images, function(image, i) {
      savePixels(image, 'png')
        .pipe(source('textile16_' + i + '.png'))
        .pipe(gulp.dest('./build/levels/house/textiles'));
    });

    cb();
  });
});

gulp.task('build-house:level', function(cb) {
  var levelPath = path.resolve('./data/HOUSE.TR2');

  loaderLevel(levelPath, function(err, level) {
    if(err) {
      return cb(err);
    }

    file('level.json', JSON.stringify(level), { src: true })
      .pipe(gulp.dest('./build/levels/house'));

    cb();
  });
});

gulp.task('build-boat', function(cb) {
  return runSequence(
    'build-boat:clean',
    ['build-boat:level', 'build-boat:textiles16'],
    cb
  );
});

gulp.task('build-boat:clean', function() {
  return gulp.src('./build/levels/boat', { read: false })
    .pipe(clean());
});

gulp.task('build-boat:textiles16', function(cb) {
  var levelPath = path.resolve('./data/BOAT.TR2');

  loaderTextiles16(levelPath, function(err, images) {
    if(err) {
      return cb(err);
    }

    _.each(images, function(image, i) {
      savePixels(image, 'png')
        .pipe(source('textile16_' + i + '.png'))
        .pipe(gulp.dest('./build/levels/boat/textiles'));
    });

    cb();
  });
});

gulp.task('build-boat:level', function(cb) {
  var levelPath = path.resolve('./data/BOAT.TR2');

  loaderLevel(levelPath, function(err, level) {
    if(err) {
      return cb(err);
    }

    file('level.json', JSON.stringify(level), { src: true })
      .pipe(gulp.dest('./build/levels/boat'));

    cb();
  });
});