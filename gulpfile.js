'use strict';

var gulp = require('gulp'), //   npm install -g gulp-cli@2.0.1 
    sass = require('gulp-sass'), // npm install gulp@3.9.1 --save-dev
    browserSync = require('browser-sync'), // npm install gulp-sass@3.1.0  browser-sync@2.23.6 --save-dev
    del = require('del'), // npm install del@3.0.0 --save-dev
    imagemin = require('gulp-imagemin'), // npm install gulp-imagemin@4.1.0 --save-dev
    uglify = require('gulp-uglify'), // npm install gulp-uglify@3.0.0 gulp-usemin@0.3.29 gulp-rev@8.1.1 gulp-clean-css@3.9.3 gulp-flatmap@1.0.2 gulp-htmlmin@4.0.0 --save-dev
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

gulp.task('sass', function () {
    return gulp.src('./css/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css'));
  });
  
  gulp.task('sass:watch', function () {
    gulp.watch('./css/*.scss', ['sass']);
  });
  
  gulp.task('browser-sync', function () {
     var files = [
        './*.html',
        './css/*.css',
        './img/*.{png,jpg,gif}',
        './js/*.js'
     ];
  
     browserSync.init(files, {
        server: {
           baseDir: "./"
        }
     });
  
  });


  
  // Default task в консали пишешь gulp  как стартовую команду и запускается браузер синк
gulp.task('default', ['browser-sync'], function() {
    gulp.start('sass:watch');
});

gulp.task('clean', function() { //будет удалена папка dist
    return del(['dist']);
});

gulp.task('copyfonts', function() {
    gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('imagemin', function() {
    return gulp.src('img/*.{png,jpg,gif}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, intelaced: true }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('usemin', function() {
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
          .pipe(usemin({
              css: [ rev() ],
              html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
              js: [ uglify(), rev() ],
              inlinejs: [ uglify() ],
              inlinecss: [ cleanCss(), 'concat' ]
          }))
      }))
      .pipe(gulp.dest('dist/')); // после минификации отправляется в папку дист
  });

gulp.task('build',['clean'], function() {
    gulp.start('copyfonts','imagemin','usemin');
});