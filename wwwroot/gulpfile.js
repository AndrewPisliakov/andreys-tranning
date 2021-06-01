const gulp = require("gulp"),
  sass = require("gulp-sass"),
  babel = require("gulp-babel"),
  cleanCSS = require("gulp-clean-css"),
  del = require("del"),
  posthtml = require("gulp-posthtml"),
  posthtmlInclude = require("posthtml-include"),
  /* const rename = require("gulp-rename"), */
  {
    get
  } = require("browser-sync");

const settings = {
  server: {
    path: "src",
  },
  distr: {
    path: "/distr",
    scss: "/scss/*.scss",
    img: "/img/**/*",
    fonts: "/fonts/**/*",
    js: "/js/**/*",
    html: "/html/*.html"

  },
  build: {
    path: "/build",
    scss: "/assets/css",
    img: "/assets/img",
    fonts: "/assets/fonts",
    js: "/assets/js",
    html: "",
  },
  watch: {
    scss: "/scss/**/*.scss",
    img: "/img/**/*",
    fonts: "/fonts/**/*",
    js: "/js/**/*",
    html: "/html/**/*.html",
  }
};

function getFullPath(exPath, assetsPath) {
  return settings.server.path + exPath + assetsPath;
}

function getDistrPath(assetsPath) {
  return getFullPath(settings.distr.path, assetsPath);
}

function getBuildPath(assetsPath) {
  return getFullPath(settings.build.path, assetsPath);
}

function getBuildPathArray(assetsArray) {
  return assetsArray.map(m => {
    return getBuildPath(m);
  });
}

function clean() {
  return del(getBuildPathArray([
    settings.build.scss,
    settings.build.img,
    settings.build.fonts,
    settings.build.js
  ]));
}

function img() {
  return gulp.src(getDistrPath(settings.distr.img))
    .pipe(gulp.dest(getBuildPath(settings.build.img)));
}

function fonts() {
  return gulp.src(getDistrPath(settings.distr.fonts))
    .pipe(gulp.dest(getBuildPath(settings.build.fonts)));
}

function styles() {
  return gulp.src(getDistrPath(settings.distr.scss))
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest(getBuildPath(settings.build.scss)));
}

function scripts() {
  return gulp.src(getDistrPath(settings.distr.js), {
      sourcemaps: true
    })
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(gulp.dest(getBuildPath(settings.build.js)));
}

function html() {
  return gulp
    .src(getDistrPath(settings.distr.html))
    .pipe(
      posthtml([
        posthtmlInclude({
          root: getDistrPath("")
        })
      ])
      .on('error', function(err) {
        console.error(err.message);
        this.emit('end');
      }))
    .pipe(gulp.dest(getBuildPath(settings.build.html)));
}

/*
 function watch() {
   gulp.watch(paths.scripts.src, scripts);
   gulp.watch(paths.styles.src, styles);
 } */

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
const build = gulp.series(clean, gulp.parallel(html, styles, scripts, img, fonts));

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