import gulp from 'gulp';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import prefix from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import cp from 'child_process';
import sourcemaps from 'gulp-sourcemaps';
import { JSConfig } from './gulp/jsconfig.js';
import runSequence from 'run-sequence';
import replace from 'gulp-replace';
import fs from 'fs';
import remove from 'gulp-html-remove';

const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
const JSoutputFolder = 'browser-resources/scripts/';
const JSJekyllOutputFolder = './dist/browser-resources/scripts/';
const CSSJekyllOutputFolder = './dist/browser-resources/css/';
const resources = 'browser-resources/';
const sassConfig = {
    options: {
        dev: {
            errLogToConsole: true,
            outputStyle: 'expanded',
            onError: browserSync.notify
        },
        build: {
            errLogToConsole: true,
            outputStyle: 'compressed',
        }
    },
    paths: [
        resources + 'css_source/critical.scss',
        resources + 'css_source/non-critical.scss',
        resources + 'css_source/main.scss',
        resources + 'css_source/gateway.scss',
        resources + 'css_source/main-editing.scss',
        resources + 'css_source/template-service.scss'
    ],
    prefixOptions: ['last 2 version', 'ie 11', 'ie 10']
};

const solutionOutput = {
    'scripts': '../src/Heineken.Website/browser-resources/scripts/',
    'css': '../src/Heineken.Website/browser-resources/css/'
}

function errorHandler(error) {
  console.log(error.toString())
  this.emit('end')
}

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify('running jekyll build');
    return cp.spawn(jekyll, ['build'], { stdio: 'inherit' })
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */

const mam = require('mock-api-middleware');
const mockApi = mam('/mockapi', { // <--- Route where to mount the API 
    mockPath: './mocks/' // <--- Where to find the API files 
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './dist',
            index: 'pages/home.html'
        },
        middleware: [
            mockApi
        ]
    });
});

/**
 *  Build the development scripts, only the main.js is included in the watch as that is used 99.9% of the time
 */
gulp.task('dev-scripts', function(callback) {
    runSequence('scripts-gateway', 'scripts-main', callback);
});
gulp.task('scripts-gateway', function () {
    return gulp.src(JSConfig['gateway'])
        .pipe(sourcemaps.init())
        .pipe(concat('gateway.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(JSoutputFolder))
        // move the file to the jekyll dist dir for development purposes
        .pipe(gulp.dest(JSJekyllOutputFolder))
        // use the uglify task to detect errors
        
});

gulp.task('scripts-main', function () {
    return gulp.src(JSConfig['main'])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        // use the uglify task to detect errors
        .pipe(uglify())
        .on('error', errorHandler)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(JSoutputFolder))
        // move the file to the jekyll dist dir for development purposes
        .pipe(gulp.dest(JSJekyllOutputFolder))
        .pipe(browserSync.reload({ stream: true }));
});

/**
 *  Build the production scripts
 */
gulp.task('production-scripts', ['prod-scripts-gateway', 'prod-scripts-gateway-oldie', 'prod-scripts-main', 'prod-scripts-main-editing', 'prod-scripts-template-service']);

gulp.task('prod-scripts-gateway', function () {
    return gulp.src(JSConfig['gateway'])
        .pipe(concat('gateway.js'))
        .pipe(gulp.dest(solutionOutput.scripts))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(solutionOutput.scripts));
});

gulp.task('prod-scripts-gateway-oldie', function () {
    return gulp.src(JSConfig['gateway-oldie'])
        .pipe(concat('gateway-oldie.js'))
        .pipe(gulp.dest(solutionOutput.scripts))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(solutionOutput.scripts));
});

gulp.task('prod-scripts-main', function () {
    return gulp.src(JSConfig['main'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(solutionOutput.scripts))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(solutionOutput.scripts));
});

gulp.task('prod-scripts-main-editing', function () {
    return gulp.src(JSConfig['main-editing'])
        .pipe(concat('main-editing.js'))
        .pipe(gulp.dest(solutionOutput.scripts))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(solutionOutput.scripts));
});

gulp.task('prod-scripts-template-service', function () {
    return gulp.src(JSConfig['template-service'])
        .pipe(concat('template-service.js'))
        .pipe(gulp.dest(solutionOutput.scripts))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(solutionOutput.scripts));
});

/**
 *  Build the development sass including sourcemaps
 */
gulp.task('dev-sass', function () {
    return gulp.src(sassConfig.paths)
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig.options.dev))
        .on('error', errorHandler)
        .pipe(prefix(sassConfig.prefixOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(resources + 'css'))
        // move the file to the jekyll dist dir for development purposes
        .pipe(gulp.dest(CSSJekyllOutputFolder))
        .pipe(browserSync.reload({ stream: true }))
});

/**
 *  Build the production ready sass
 */
gulp.task('prod-sass', function (options) {
    return gulp.src(sassConfig.paths)
        .pipe(sass(sassConfig.options.build))
        .pipe(prefix(sassConfig.prefixOptions))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(resources + 'css'))
        .pipe(gulp.dest(solutionOutput.css));
});

gulp.task('prod-sass-expanded', function (options) {
    return gulp.src(sassConfig.paths)
        .pipe(sass(sassConfig.options.dev))
        .pipe(prefix(sassConfig.prefixOptions))
        .pipe(gulp.dest(resources + 'css'))
        .pipe(gulp.dest(solutionOutput.css));
});

gulp.task('critical-css', function() {
    return gulp.src(['../src/Heineken.Website/Views/layouts/Default.cshtml', '../src/Heineken.Website/Views/layouts/Blankpage.cshtml' ], { base: './'})
        .pipe(replace(/<style inline-style>([\s\S]+?)<\/style>/g, function(s, filename) {
            var style = fs.readFileSync('browser-resources/css/critical.min.css', 'utf8');
            style = style.replace(/@/g, "@@");
            return '<style inline-style>\n' + style + '\n</style>';
        }))
        .pipe(gulp.dest('.'));
    });

/**
 *  Development watch task
 */
gulp.task('watch', function () {
    gulp.watch(['pages/**/*.html', 'templates/**/*', 'models/**/*.json'], ['jekyll-rebuild']);
    gulp.watch(resources + 'css_source/**/*.scss', ['dev-sass']);
    gulp.watch('browser-resources/scripts_source/**/*.js', ['dev-scripts']);
});

/**
 * Default task, running just `gulp` will compile the sass, build the js
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', function(callback) {
    runSequence('jekyll-build', ['dev-scripts','dev-sass'], 'browser-sync', 'watch', callback);
});

/**
 * Build production ready assets
 */
gulp.task('build', function(callback) {
     runSequence('production-scripts', 'prod-sass', 'prod-sass-expanded', 'critical-css');
});
