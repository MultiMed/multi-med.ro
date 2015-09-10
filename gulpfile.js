'use strict';

var gulp = require('gulp');

var del = require('del');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var sourcemaps = require('gulp-sourcemaps');
var modernizr = require('gulp-modernizr');

gulp.task('clean', function() {
  return del(['out/**']);
});

gulp.task('copy:html', function() {
    var stream = gulp.src(['src/html/**'])
        .pipe(gulp.dest('out/'));

    return stream;
});

gulp.task('copy:css', function() {
    var stream = gulp.src(['src/sass/**'])
        .pipe(sourcemaps.init())
            .pipe(sass().on('error',sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('out/'));

    return stream;
});

gulp.task('copy:img', function() {
    var stream = gulp.src(['src/images/**'])
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('out/'));

    return stream;
});

gulp.task('copy:js', function() {
    var stream = gulp.src(['src/javascript/**'])
        .pipe(modernizr())
        .pipe(gulp.dest('out/'));

    return stream;
});

gulp.task('default', ['copy:html', 'copy:css', 'copy:img', 'copy:js']);

gulp.task('install', function() {
  // place code for install task here
});
