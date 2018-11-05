var gulp				  = require('gulp'),
    sass 				  = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    flatten       = require('gulp-flatten'),
    browserSync   = require('browser-sync'),
    webpack       = require('webpack-stream');

// sass compiler
gulp.task('sass', function() {
  return gulp.src("dist/sass/**/*.scss")
    .pipe(sass({
      includePaths: ['node_modules/']
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest("app/css"));
});

// icon task
gulp.task('fonts', function () {
  return gulp.src('./node_modules/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(flatten())
    .pipe(gulp.dest("app/fonts"));
});

// js compiler
gulp.task('js', function(){
  return gulp.src("dist/js/app.js")
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("app/js/"));
});

// serve task
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: {
      baseDir: "./app/"
    }
  });

  gulp.watch("dist/sass/**/*.scss", ['sass', 'fonts']);
  gulp.watch("dist/js/**/*.js", ['js']);
  gulp.watch("app/css/**/*.css").on('change', browserSync.reload);
  gulp.watch("app/js/**/*.js").on('change', browserSync.reload);
  gulp.watch("app/*.html").on('change', browserSync.reload);

});

gulp.task('default', ['serve']);