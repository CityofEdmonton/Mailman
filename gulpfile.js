var browserify = require('browserify');
var gjslint = require('gulp-gjslint');
var gulp = require('gulp');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var source = require('vinyl-source-stream');

var exec = require('child_process').exec;
var fs = require('fs');

// These are the primary tasks
gulp.task('test-gas', ['deploy-gas'], openGAS);
gulp.task('test-web', ['build-web'], openWeb);

// These are the build tasks
gulp.task('deploy-gas', ['build-gas'], deployGAS);
gulp.task('browserify', browserifyBundle);
gulp.task('build-gas', ['browserify'], buildGAS);
gulp.task('build-web', ['browserify'], buildWeb);
gulp.task('lint-all', closureLint);
gulp.task('fix-all', closureFix);

/**
 * Bundles up client.js (and all required functionality) and places it in a build directory.
 *
 */
function browserifyBundle() {
  return browserify('./src/client/js/client.js')
    .bundle()
    .on('error', function(e) {
      gutil.log(e);
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build'));
}

/**
 * Builds the project for GAS.
 * GAS doesn't allow seperate CSS or JS, so both need to be injected into the main HTML.
 * TODO Make this more dynamic. It should swap out the script ref for the actual script.
 */
function buildGAS() {
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
}

/**
 * Builds the project for the web.
 *
 */
function buildWeb() {
  gulp.src('./build/bundle.js')
    .pipe(gulp.dest('./build/web'));

  // HTML
  gulp.src('./src/client/html/*.html')
    .pipe(gulp.dest('./build/web'));

  // GAS
  gulp.src('./src/GAS/*')
    .pipe(gulp.dest('./build/web/GAS'));
}

/**
 * Deploys the GAS code up to the project.
 * Calls browserifyBundle, then buildGAS.
 *
 */
function deployGAS(cb) {
  exec('gapps push', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

/**
 * Opens up the project in GAS in chrome.
 * Calls browserifyBundle, then buildGAS, then deployGAS.
 *
 */
function openGAS(cb) {
  // Open the project in chrome
  var key = JSON.parse(fs.readFileSync('gapps.config.json', 'utf8')).fileId;

  var chrome = 'start chrome https://script.google.com/a/edmonton.ca/d/' + key + '/edit';
  exec(chrome, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

/**
 * Opens up the project in chrome.
 * Calls browserifyBundle, then buildWeb.
 *
 */
function openWeb(cb) {
  var chrome = 'start chrome ./build/web/ListSetupSidebar.html';
  exec(chrome, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

/**
 * Runs Google's own Closure Linter on the JS destined for the web
 *
 */
function closureLint() {
  // flags: https://github.com/jmendiara/node-closure-linter-wrapper#flags
  var lintOptions = {
    flags: ['--max_line_length 120', '--strict']
  };

  // Output all failures to the console, and \then fail.
  gulp.src(['./src/**/*.js'])
    .pipe(gjslint(lintOptions))
    .pipe(gjslint.reporter('console'));
}

/**
 * Attempts to automatically fix many of the errors that gjslint checks for.
 * Runs a shell command.
 */
function closureFix(cb) {

  var fixJS = 'fixjsstyle --strict --max_line_length 120 -r ./src';

  exec(fixJS, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}
