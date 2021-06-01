const gulp = require('gulp');
const sass = require('gulp-sass');
/* const babel = require('gulp-babel'); */
const concat = require('gulp-concat');
/* const uglify = require('gulp-uglify'); */
/* const rename = require('gulp-rename'); */
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const { get } = require('browser-sync');

const settings = {
    server: {
        path: 'wwwroot/src',
    },
    distr: {
        path: '/distr',
        scss: '/scss/*.scss',
        img: '/img/**/*',
        fonts: '/fonts/**/*',
        js: '/js/**/*',
        html: '/html/*.html'
        
    },
    build: {
        path: '/build',
        scss: '/assets/css',
        img: '/assets/img',
        fonts: '/assets/fonts',
        js: 'assets/js',
        html: '',
    },
    watch: {
        scss: '/scss/**/*.scss',
        img: '/img/**/*',
        fonts: '/fonts/**/*',
        js: '/js/**/*',
        html: '/html/**/*.html',
    }
};

function getFullPath(exPath, assetsPath) {
    return settings.server.path + exPath + assetsPath;
}

function getDistrPath(assetsPath){
    return getFullPath(settings.distr.path, assetsPath); 
}

function getBuildPath(assetsPath){
    return getFullPath(settings.build.path, assetsPath); 
}
function getBuildPathArray(assetsArray) {
    return assetsArray.map(m => {return getBuildPath(m);});
} 

function clean() {
    return del(getBuildPathArray([ 
        settings.build.scss, 
        settings.build.img,     
        settings.build.fonts,
        settings.build.js 
    ]));
  }
   
  function styles() {
    return gulp.src(getDistrPath(settings.distr.scss))
      .pipe(sass())
      .pipe(cleanCSS())
      .pipe(gulp.dest(getBuildPath(settings.build.scss)));
  }
 /*   
  function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
      .pipe(babel())
      .pipe(uglify())
      .pipe(concat('main.min.js'))
      .pipe(gulp.dest(paths.scripts.dest));
  }
   
  function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
  } */
   
  /*
   * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
   */
  var build = gulp.series(clean, gulp.parallel(styles, /* scripts */));
   
  /*
   * You can use CommonJS `exports` module notation to declare tasks
   */
  exports.clean = clean;
  exports.styles = styles;
  /* exports.scripts = scripts;
  exports.watch = watch; */
  exports.build = build;
  /*
   * Define default task that can be called by just running `gulp` from cli
   */
  exports.default = build;