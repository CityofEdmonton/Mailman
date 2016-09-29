// NPM packages
var browserify = require('browserify');
var gjslint = require('gulp-gjslint');
var gulp = require('gulp');
var gutil = require('gulp-util');
var htmlProcessor = require('gulp-htmlprocessor');
var open = require('gulp-open');
var os = require('os');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var stringify = require('stringify');

// Node modules
var exec = require('child_process').exec;
var fs = require('fs');

// These are the primary tasks
gulp.task('test-gas', ['deploy-gas'], openGAS);
gulp.task('test-web', ['build-web'], openWeb);

// General
gulp.task('lint-all', closureLint);
gulp.task('fix-all', closureFix);
gulp.task('browserify', browserifyBundle);
gulp.task('compile-sass', compileSASS);

// Web specific
gulp.task('build-web', ['browserify', 'compile-sass'], buildWeb);

// GAS specific
gulp.task('deploy-gas', ['swap-tags'], deployGAS);
gulp.task('swap-tags', ['build-gas'], replaceTags);
gulp.task('build-gas', ['browserify', 'compile-sass'], buildGAS);


/**
 * Bundles up client.js (and all required functionality) and places it in a build directory.
 * We apply a stringify transform. This package finds requires that require .html files. It swaps them out for the actual text.
 * This is great for breaking up html and can be used as a templating tool.
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function browserifyBundle() {
  return browserify('./src/client/js/client.js')
      .transform(stringify, {
        appliesTo: { includeExtensions: ['.html'] },
        minify: false
      })
      .bundle()
      .on('error', function(e) {
        gutil.log(e);
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./build/common'));
}


/**
 * Builds the project for GAS.
 * GAS doesn't allow seperate CSS or JS, so both need to be injected into the main HTML.
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function buildGAS() {

  gulp.src('./src/client/html/**', {
    base: './src/client'
  })
      .pipe(gulp.dest('./build/gas'));

  // GAS
  return gulp.src('./src/GAS/*')
      .pipe(gulp.dest('./build/gas/GAS'));
}


/**
 * Replaces all script tags and css links.
 * Note: This is done relative to this gulpfile.
 * All swap tags are relative to this gulpfile.
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function replaceTags() {
  return gulp.src('./build/gas/html/*.html')
      .pipe(htmlProcessor({
        includeBase: './'
      }))
      .pipe(gulp.dest('./build/gas/html/'));
}


/**
 * Builds the project for the web.
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function buildWeb() {
  gulp.src('./build/common/bundle.js')
      .pipe(gulp.dest('./build/web/client/js'));

  gulp.src('./src/client/css/*')
      .pipe(gulp.dest('./build/web/client/css'));

  gulp.src('./src/client/html/*')
      .pipe(gulp.dest('./build/web/client/html'));

  gulp.src('./src/client/images/*')
      .pipe(gulp.dest('./build/web/client/images'));

  gulp.src('./build/common/css/*')
      .pipe(gulp.dest('./build/web/client/css'));

  return gulp.src('./src/GAS/*')
      .pipe(gulp.dest('./build/web/GAS'));
}


/**
 * Deploys the GAS code up to the project. 
 * Calls browserifyBundle, then buildGAS.
 *
 * @param  {callback} cb - a callback so the engine knows when it'll be done
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function deployGAS(cb) {
  return exec('gapps push', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}


/**
 * Opens up the project in GAS in Google Chrome.
 * Calls browserifyBundle, then buildGAS, then deployGAS.
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function openGAS() {
  var key = JSON.parse(fs.readFileSync('gapps.config.json', 'utf8')).fileId;
  var url = 'https://script.google.com/a/edmonton.ca/d/' + key + '/edit';

  var browser = os.platform() === 'win32' ? 'chrome' : (
      os.platform() === 'linux' ? 'google-chrome' : (
      os.platform() === 'darwin' ? 'google chrome' : 'firefox'));

  var options = {
    uri: url,
    app: browser
  };

  return gulp.src(__filename)
      .pipe(open(options));
}


/**
 * Opens up the project in Google Chrome.
 * Calls browserifyBundle, then buildWeb.
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function openWeb() {
  var browser = os.platform() === 'win32' ? 'chrome' : (
      os.platform() === 'linux' ? 'google-chrome' : (
      os.platform() === 'darwin' ? 'google chrome' : 'firefox'));

  return gulp.src('./build/web/client/html/NewEmailDialog.html')
      .pipe(open({app: browser}));
}


/**
 * Runs Google's own Closure Linter on the JS destined for the web
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function closureLint() {
  // flags: https://github.com/jmendiara/node-closure-linter-wrapper#flags
  var lintOptions = {
    flags: ['--max_line_length 120', '--strict']
  };

  // Output all failures to the console, and then fail.
  return gulp.src(['./src/**/*.js'])
      .pipe(gjslint(lintOptions))
      .pipe(gjslint.reporter('console'));
}


/**
 * Attempts to automatically fix many of the errors that gjslint checks for.
 * Runs a shell command.
 *
 * @param  {callback} cb - a callback so the engine knows when it'll be done
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function closureFix(cb) {

  var fixJS = 'fixjsstyle --strict --max_line_length 120 -r ./src';

  return exec(fixJS, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}


/**
 * Compiles SASS (?) ¯\_(ツ)_/¯
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function compileSASS() {
  return gulp.src('./src/client/sass/*.scss')
      .pipe(sass().on('error', function(error) {
        var message = new gutil.PluginError('sass', error.messageFormatted).toString();
        process.stderr.write(message + '\n');
        process.exit(1);
      }))
      .pipe(gulp.dest('./build/common/css'));
}
