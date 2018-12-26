/**
 * For reference Gulp 4 sample gulpfile.js
 * https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a
 */

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

sass.compiler = require('node-sass');

function sassFiles(){
    return gulp
      .src('./css/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(dest('./css'));
}

function watchFiles(){
   gulp.watch('./css/*.scss', sassFiles);
}

function browserSyncReload(){
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
}

function clean(){
    return del(['dist']);
}

function copyFonts(){
    return gulp
            .src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
            .pipe(gulp.dest('./dist/fonts'));
}

function imagesMin(){
    return gulp
            .src('img/*.{png,jpg,gif}')
            .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest('dist/img'));
}

function useMinConfigure(){
    return gulp
            .src('./*.html')
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
            .pipe(gulp.dest('dist/'));
}
  // Default task
exports.default = gulp.parallel(watchFiles, browserSyncReload);

// Build task
exports.build = gulp.series(clean, gulp.parallel(copyFonts, imagesMin, useMinConfigure));