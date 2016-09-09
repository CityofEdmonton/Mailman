var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

gulp.task('default', function () {
  // place code for your default task here
});

gulp.task('browserify', function () {
  return browserify('./src/client/client.js')
    .bundle()
    .on('error', function () {
      gutil.log(e);
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/production'));
});
