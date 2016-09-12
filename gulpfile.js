var gulp = require('gulp');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var fs = require('fs');

/**
 * Runs the default build tasks.
 *
 */
gulp.task('default', function () {
  // place code for your default task here
});

/**
 * Bundles up client.js (and all required functionality) and places it in a build directory.
 *
 */
gulp.task('browserify', function () {
  return browserify('./src/client/js/client.js')
    .bundle()
    .on('error', function () {
      gutil.log(e);
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build'));
});

/**
 * Builds the project for GAS.
 *
 */
 gulp.task('build-gas', ['browserify'], function () {
   // HTML
   var jsFile = fs.readFileSync('./build/bundle.js', 'utf8');

    // Resolved an issue where $& in the replacement string would be replaced by the matched string.
    // It required me to use a function instead of a string as the second param.
   gulp.src('./src/client/html/*.html')
   .pipe(replace(/<script src="\w*.js">\s*<\/script>/g, function(match, p1, p2, p3, offset, string) {
     return '<script type="text/javascript">\n' + jsFile + '\n</script>';
   }))
   .pipe(gulp.dest('./build/gas'));

   // GAS
   gulp.src('./src/GAS/*')
   .pipe(gulp.dest('./build/gas/GAS'));
 });

 /**
  * Builds the project for the web.
  *
  */
  gulp.task('build-web', ['browserify'], function () {
    gulp.src('./build/bundle.js')
    .pipe(gulp.dest('./build/web'));

    // HTML
    gulp.src('./src/client/html/*.html')
    .pipe(gulp.dest('./build/web'));

    // GAS
    gulp.src('./src/GAS/*')
    .pipe(gulp.dest('./build/web/GAS'));
  });
