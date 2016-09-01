'use strict';

var gulp = require('gulp');
var sassCompiler = require('gulp-sass');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
//var postcss      = require('gulp-postcss');
//var autoprefixer = require('gulp-autoprefixer');

var scssMonitorGlob = ['./sass/homepage.scss', './sass/homepage/*.scss']; //Find files with scss extension but ignore files that are named sourcejs.scss
var scssHomeGlob = ['./sass/homepage.scss'];
var jsGlob = './js/homepage.js';

gulp.task('sassCompiler', function () {
  return gulp.src(scssHomeGlob) //Find all files with .scss extension recursively starting from rootfolder
	.pipe(sassCompiler({ outputStyle: 'compressed' }).on('error', sassCompiler.logError)) //Compile using sassCompiler
	.pipe(concat('homepage.css')) //Concat the files to one file
  //.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
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
