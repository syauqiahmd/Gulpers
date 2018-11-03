var gulp 				= require('gulp');
var browserSync	= require('browser-sync').create(); 
var sass				= require('gulp-sass'); 

gulp.task('serve', ['sass'], function() {

	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch("resources/sass/app.scss", ['sass']);
	gulp.watch("./*.html").on('change', browserSync.reload);

});

gulp.task('sass', function() {
	return gulp.src("resources/sass/app.scss")
		.pipe(sass())
		.pipe(gulp.dest("assets/css"))
		.pipe(browserSync.stream());
});

gulp.task('default', ['serve']);