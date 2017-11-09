'use strict';

// VARS
var port = 8000;
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');
var autoprefixerCore = require('autoprefixer-core');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');

// PATHS
var PATHS = {
	cssPath: './dist/css',
	miniFile: 'style.min.css',
	mainScssFile: './src/styles/style.scss'
};

// SCSS
gulp.task('sass', function () {
	// MERGE THE TWO STREAMS AND CONCATENATE THEIR CONTENTS INTO A SINGLE FILE
	return gulp.src(PATHS.mainScssFile)
		.pipe(concat(PATHS.miniFile))
		.pipe(sass({
			outputStyle: 'compressed',
			errLogToConsole: true
		}).on('error', sass.logError))
		.pipe(sourcemaps.init())
		.pipe(postcss([autoprefixerCore]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(PATHS.cssPath));
});

// JAVASCRIPT
gulp.task('javascript', function () {
	gulp.src(['./src/scripts/**/*']).pipe(gulp.dest('dist/scripts'));
});

// IMAGES
gulp.task('images', function () {
	gulp.src(['./src/images/**/*']).pipe(gulp.dest('dist/images'));
});

// WEB SERVER WATCHER
gulp.task('webserver', function () {
	gulp.src('').pipe(webserver({
		'port': port,
		'fallback': 'index.html',
		'livereload': true,
		'directoryListing': true,
		'open': 'index.html'
	}));
});

// DIST FOLDER
gulp.task('build',function(){
	// RUN ONCE
	gulp.run('sass');
	gulp.run('javascript');
	gulp.run('images');
});

// DEFINE DEFAULT TASK
gulp.task('default', function () {
	// RUN BUILD
	gulp.run('build');
	// RUN WEB SERVER
	gulp.run('webserver');
	// WATCH
	gulp.watch(['./src/styles/style.scss', './src/scripts/**/*', './src/images/*'], ['sass', 'javascript','images']);
});