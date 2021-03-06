'use strict';

var gulp = require('gulp');

var del = require('del');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var sourcemaps = require('gulp-sourcemaps');
var modernizr = require('gulp-modernizr');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var newer = require('gulp-newer');

gulp.task('clean', function() {
    return del(['out/**']);
});

gulp.task('copy:html', function() {
    return gulp.src(['src/html/**/*.html'])
        .pipe(gulp.dest('out/'))
        .pipe(reload({ stream:true }));
});

gulp.task('copy:docs', function() {
    return gulp.src(['src/docs/**'])
        .pipe(gulp.dest('out/docs/'));
});

gulp.task('copy:css', function() {
    return sass('src/sass/**/*.scss',
            {
                sourcemap: true,
                compass: true
            })
            .on('error', sass.logError)
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('out/'))
            .pipe(reload({ stream:true }));
});

gulp.task('copy:img', function() {
    return gulp.src(['src/images/**'])
        .pipe(newer('out/'))
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('out/'));
});

gulp.task('build:modernizr', function() {

    return gulp.src(['src/javascript/**', 'src/html/**', 'src/sass/**'])
        .pipe(concat('combined'))
        .pipe(modernizr({
            excludeTests: [],
            tests: []
        }))
        .pipe(gulp.dest('out/js/'))
        .pipe(rename('modernizr.min.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('out/js/'));
});

gulp.task('copy:js', ['build:modernizr'], function() {
    return merge(
        gulp.src(['src/javascript/**'])
            .pipe(gulp.dest('out/')),
        gulp.src(['vendor/jquery/dist/*.js'])
            .pipe(gulp.dest('out/js')),
        gulp.src(['vendor/jquery/dist/*.map'])
            .pipe(gulp.dest('out/js/maps'))
    );
});

gulp.task('default', ['copy:html', 'copy:css', 'copy:img', 'copy:js', 'copy:docs']);

gulp.task('watch', function() {
    return gulp.watch(['src/**'], ['default']);
});

gulp.task('live', ['default'], function() {

    browserSync({
        server: {
            baseDir: 'out'
        }
    });

    return gulp.watch(['src/**'], ['default']);
});


gulp.task('install', function() {
  // place code for install task here
});
