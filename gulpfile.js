'use strict';
var gulp = require('gulp'),
    changed = require('gulp-changed'),
    sass = require('gulp-sass'),
    autoPrefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    mocha = require('gulp-mocha'),
    pump = require('pump'),
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    concat = require('gulp-concat');

var sassFile = 'sass/*.scss',
    sassSrc = 'sass/',
    cssFile = 'css/*.css',
    cssSrc = 'css',
    jsFile = 'js/*.js',
    jsSrc = 'js',
    distCssSrc = 'dist/css',
    distJsSrc = '../js';

// sass to css
gulp.task('sass-to-css', function(){
  return gulp.src(sassFile)
      .pipe(changed(sassFile))
      .pipe(sass().on('error', function (e) {
        console.error(e.message);
      }))
      .pipe(autoPrefixer({
        browsers: ['last 99 versions']
      }))
      // .pipe(gulp.dest(cssSrc))
      //.pipe(concat('newModule.css'))
      .pipe(gulp.dest(cssSrc));
});

// css minify
gulp.task('minify-css', function() {
  return gulp.src(cssFile)
      .pipe(changed(cssFile))
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(distCssSrc));
});

//js lint
gulp.task('eslint', function () {
  return gulp.src(jsFile)
      .pipe(changed(jsFile))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

// js minify
gulp.task('jscompress', ['eslint'], function (cb) {
  pump([
        gulp.src(jsFile),
        uglify(),
        // rename({ suffix: '.min' }),
        gulp.dest(distJsSrc)
      ],
      cb
  );
});

// watch sass
gulp.task('watch-sass', function (done) {
  gulp.watch(sassFile, ['sass-to-css'])
      .on('end', done);
});
// watch css
gulp.task('watch-css', function (done) {
  gulp.watch(cssFile, ['minify-css'])
      .on('end', done);
});
// watch js
gulp.task('watch-js', function (done) {
  gulp.watch(jsFile, ['jscompress'])
      .on('end', done);
});

// watch
gulp.task('watch', ['watch-sass', 'watch-css', 'watch-js']);

gulp.task('default',['watch']);