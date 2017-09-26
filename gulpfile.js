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
var del = require('del');
var jsdoc = require('gulp-jsdoc3');

// Used for our new bundle system
var rename = require('gulp-rename');
var es = require('event-stream');

// Node modules
var exec = require('child_process').exec;
var fs = require('fs');

// These are the primary tasks
gulp.task('test-gas', ['deploy-gas'], openGAS);
gulp.task('test-web', ['build-web'], openWeb);

// General
gulp.task('lint-all', closureLint);
gulp.task('browserify', browserifyBundle);
gulp.task('compile-sass', compileSASS);
gulp.task('clean', clean);
gulp.task('generate-doc', jsdocGenerate);

// Web specific
gulp.task('build-web', ['browserify', 'compile-sass'], buildWeb);

// GAS specific
gulp.task('deploy-gas', ['build-gas'], deployGAS);
gulp.task('build-gas', ['browserify', 'compile-sass'], buildGAS);

/**
 * Bundles up client.js (and all required functionality) and places it in a build directory.
 * We apply a stringify transform. This package finds requires that require .html files. It swaps them out for the actual text.
 * This is great for breaking up html and can be used as a templating tool.
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function browserifyBundle() {
    // we define our input files, which we want to have bundled:
    var files = [
        './src/client/js/client.js',
        './src/client/js/picker.js'
    ];

    // map them to our stream function
    var tasks = files.map(function(entry) {
		    var path = entry.split('/');

        return browserify(entry)
            .transform(stringify, {
                appliesTo: {
                    includeExtensions: ['.html']
                },
                minify: false
            })
            .bundle()
            .on('error', function(e) {
                gutil.log(e);
            })
            .pipe(source(path[path.length - 1]))
            // rename them to have "bundle as postfix"
            .pipe(rename({
                extname: '.bundle.js'
            }))
            .pipe(gulp.dest('./build/common'));
    });

    // create a merged stream
    return es.merge.apply(null, tasks);
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
        .pipe(htmlProcessor({
            includeBase: './'
        }))
        .pipe(gulp.dest('./build/gas'));

    // GAS
    return gulp.src('./src/gas/**/*.js')
        .pipe(gulp.dest('./build/gas/gas'));
}


/**
 * Builds the project for the web.
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function buildWeb() {
    gulp.src('./build/common/*.bundle.js')
        .pipe(gulp.dest('./build/web/client/js'));

    gulp.src('./src/client/css/*')
        .pipe(gulp.dest('./build/web/client/css'));

    gulp.src('./src/client/html/*')
        .pipe(gulp.dest('./build/web/client/html'));

    gulp.src('./src/client/images/*')
        .pipe(gulp.dest('./build/web/client/images'));

    gulp.src('./build/common/css/*')
        .pipe(gulp.dest('./build/web/client/css'));

    return gulp.src('./src/gas/*')
        .pipe(gulp.dest('./build/web/gas'));
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

    return gulp.src('./build/web/client/html/mailman.html')
        .pipe(open({
            app: browser
        }));
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
 * Compiles SASS into CSS.
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

/**
 * Removes all builds.
 *
 * @return {stream} the stream as the completion hint to the gulp engine
 */
function clean() {
    return del([
        'build/**/*'
    ]);
}

function jsdocGenerate(cb) {
  gulp.src(['./src/**/*.js'])
        .pipe(jsdoc(cb));
}
