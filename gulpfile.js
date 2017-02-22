'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sassCompiler = require('gulp-sass');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');

var scssMonitorGlob = ['./sass/homepage.scss', './sass/homepage/*.scss']; //Find files with scss extension
var scssHomeGlob = ['./sass/homepage.scss'];
var jsGlob = ['./js/homepage.js'];

gulp.task('sassCompiler', function () {
  return gulp.src(scssHomeGlob) //Find all files with .scss extension recursively starting from rootfolder
	.pipe(sassCompiler({ outputStyle: 'normal' }).on('error', sassCompiler.logError)) //Compile using sassCompiler
  //.pipe(concat('homepage.css')) //Concat the files to one file
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(cssnano())
  .pipe(gulp.dest('./css/')); //Set destination folder
});

gulp.task('jsMinifier', function () {
  gulp.src(jsGlob)
  .pipe(concat('homepage.js'))
  .pipe(minify({
    ext:{
      min:'.min.js',
    },
    exclude: ['tasks'],
    ignoreFiles: ['.combo.js', '-min.js', '.min.js'],
    compress:true,
  }))
  .pipe(gulp.dest('js'));
});

gulp.task('watch', ['sassCompiler', 'jsMinifier'], function () {
  gulp.watch(scssMonitorGlob, ['sassCompiler']);
  gulp.watch(jsGlob, ['jsMinifier']);
});

gulp.task('serve', ['watch'], function () {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch("*.html").on("change", reload);
});