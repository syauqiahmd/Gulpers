var gulp				  = require('gulp'),
    sass 				  = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserSync   = require('browser-sync');

// sass compiler
gulp.task('sass', function() {
  return gulp.src("dist/sass/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest("app/css"));
});

// serve task
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: {
      baseDir: "./app/"
    }
  });

  gulp.watch("dist/sass/**/*.scss", ['sass']);
  gulp.watch("app/css/**/*.css").on('change', browserSync.reload);
  gulp.watch("app/*.html").on('change', browserSync.reload);

});

gulp.task('default', ['serve']);