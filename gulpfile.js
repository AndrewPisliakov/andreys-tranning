const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');


function browsersync () {
    browserSync.init({
        server: { baseDir: 'wwwroot/src/build'},
        notify: false,
        online: true
    })
}

function cleanimg() {
    return del('wwwroot/src/build/assets/img/dest/**/*', { force: true })
}

function images() {
    return src('wwwroot/src/build/assets/img/srs/**/*')
    .pipe(newer('wwwroot/src/build/assets/img/dest'))
    .pipe(imagemin())
    .pipe(dest('wwwroot/src/build/assets/img/dest'))
}

function startwatch () {
    watch('wwwroot/src/build/**/*.html').on('change', browserSync.reload);
    watch('wwwroot/src/build/assets/img/srs/**/*', images)
}

exports.browsersync = browsersync;
exports.images = images;
exports.cleanimg = cleanimg; 


exports.default = parallel(browsersync, startwatch); 