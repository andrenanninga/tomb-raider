'use strict';

var gulp        = require('gulp');
var connect     = require('gulp-connect');
var plumber     = require('gulp-plumber');
var browserify  = require('gulp-browserify');

gulp.task('webserver', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('watch-mesh', ['webserver', 'build-mesh'], function() {
  gulp.watch('src/mesh/*.*', ['build-mesh']);
});

gulp.task('build-mesh', function(){ 
  gulp.src('./src/mesh/index.html')
    .pipe(plumber())
    .pipe(gulp.dest('./build/mesh'));

  gulp.src('./src/mesh/index.js')
    .pipe(plumber())
    .pipe(browserify())
    .pipe(gulp.dest('./build/mesh'))
    .pipe(connect.reload());
});
