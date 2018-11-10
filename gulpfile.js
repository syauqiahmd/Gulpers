var gulp				  = require('gulp'),
    sass 				  = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    flatten       = require('gulp-flatten'),
    browserSync   = require('browser-sync'),
    webpack       = require('webpack-stream'),
    gulpif        = require('gulp-if'),
    extend        = require('extend'),
    image         = require('gulp-image'),
    buildType     = "dev"
    
// sass compiler
gulp.task('sass', function() {
  console.log(buildType);
  return gulp.src("dist/sass/**/*.scss")
    .pipe(sass({
      outputStyle: gulpif(buildType == "prod", 'compressed', 'compact'),
      includePaths: ['node_modules/']
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest("app/css"));
});

// icon and font task
gulp.task('fonts', function() {
  return gulp.src('./node_modules/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(flatten())
    .pipe(gulp.dest("app/fonts"));
});

// js compiler
gulp.task('js', function() {
  var config = extend({}, require('./webpack.config.js'), {
    mode: gulpif(buildType == "prod", 'production', 'development'),
  });
  return gulp.src("dist/js/app.js")
    .pipe(webpack(config))
    .pipe(gulp.dest("app/js/"));
});

//image optimization task
gulp.task('image', function() {
  gulp.src("dist/img/**/**")
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      guetzli: false,
      gifsicle: true,
      svgo: true,
      concurrent: 10,
      quiet: false,
      options: {
        optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
        pngquant: ['--speed=1', '--force', 256],
        zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
        jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
        mozjpeg: ['-optimize', '-progressive'],
        guetzli: ['--quality', 85],
        gifsicle: ['--optimize'],
        svgo: ['--enable', 'cleanupIDs', '--disable', 'convertColors']
      }
    }))
    .pipe(gulp.dest("app/img/"));
});

//watcher task 
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
gulp.task('prod', function() {
  buildType = 'prod'
  gulp.start(['sass', 'fonts', 'js'])
})

//set default task
gulp.task('default', ['watch']);
