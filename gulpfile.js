'use strict';

const { src, dest, watch } = require('gulp');
const less                 = require('gulp-less');
const autoprefixer         = require('gulp-autoprefixer');
const cleanCSS             = require('gulp-clean-css');
const rename               = require('gulp-rename');
const plumber              = require('gulp-plumber');
const cache                = require('gulp-cached');
const notify               = require('gulp-notify');

const enableNotifications = true;
const successNotifications = false;

const lessFiles = [
    'less/*.less',
    'application/**/*.less',
    '!application/**/_*.less',
    '!application/**/*.bk.less',
    '!application/themes/custom/css/accessibility/*.less',
];

function css() {
    var errors = [];
    return src(lessFiles, { base: '.', sourcemaps: false })
        .pipe(plumber({
            errorHandler: function(err) {
                errors.push(err);
            }
        }))
        .pipe(cache('less', { optimizeMemory: true }))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cleanCSS({ level: {
            2: {
                skipProperties: [
                    'font-size'
                ]
            }
        } }))
        .pipe(rename(function(path) {
            if (/(\\|\/)css(\\|\/)less$/i.test(path.dirname)) {
                path.dirname += '/..';
            }
        }))
        .pipe(dest('./', { sourcemaps: '/sourcemaps' }))
        .on('end', function() {
            if (enableNotifications && (successNotifications || errors.length > 0)) {
                notify.onError({
                    appID: 'Gulp: ' + __dirname,
                    title: 'Gulp CSS',
                    message: '<%= options.compileErrors %><%= options.seeConsole %>',
                    sound: false,
                    wait: errors.length > 0,
                    templateOptions: {
                        compileErrors: errors.length + ' compile error' + (errors.length !== 1 ? 's' : ''),
                        seeConsole: errors.length > 0 ? ', see console for details.' : '.',
                    }
                })(0);
            }
            errors.forEach(error => console.error(error.message));
        });
}

exports.css = css;
exports.default = function() {
    watch(lessFiles, css);
};