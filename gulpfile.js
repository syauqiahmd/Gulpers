var gulp				  = require('gulp'),
    sass 				  = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    flatten       = require('gulp-flatten'),
    browserSync   = require('browser-sync'),
    webpack       = require('webpack-stream'),
    gulpif        = require('gulp-if'),
    extend        = require('extend'),
    buildType     = "dev"

// sass compiler
gulp.task('sass', function() {
  console.log(buildType);
  return gulp.src("dist/sass/**/*.scss")
  .pipe(sass({
    outputStyle: gulpif(buildType=="prod", 'compressed', 'compact'),
    includePaths: ['node_modules/']
  }))
  .pipe(autoprefixer())
  .pipe(gulp.dest("app/css"));
});

// icon task
gulp.task('fonts', function() {
  return gulp.src('./node_modules/**/*.{eot,svg,ttf,woff,woff2}')
  .pipe(flatten())
  .pipe(gulp.dest("app/fonts"));
});

// js compiler
gulp.task('js', function(){
  var config = extend({}, require('./webpack.config.js'), {
    mode: gulpif(buildType=="prod", 'production', 'development'),
  });
  return gulp.src("dist/js/app.js")
  .pipe(webpack(config))
  .pipe(gulp.dest("app/js/"));
});

gulp.task('watch', ['sass', 'fonts', 'js'], function() {
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

// serve task
gulp.task('dev', function() {
  gulp.start(['sass', 'fonts', 'js'])
});

//prod taks
gulp.task('prod', function(){
  buildType = 'prod'
  gulp.start(['sass', 'fonts', 'js'])
})

gulp.task('default', ['watch']);
