var gulp				= require('gulp');
var browserSync = require('browser-sync').create();
var sass 				= require('gulp-sass');

// serve task
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });

  gulp.watch("dist/sass/**/*.scss", ['sass']);
  gulp.watch("app/*.html").on('change', browserSync.reload);

});

// sass compiler
gulp.task('sass', function() {
  return gulp.src("dist/sass/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);