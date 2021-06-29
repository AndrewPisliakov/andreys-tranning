const gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  sass = require('gulp-sass')(require('sass')),
  babel = require("gulp-babel"),
  cleanCSS = require("gulp-clean-css"),
  del = require("del"),
  posthtml = require("gulp-posthtml"),
  posthtmlInclude = require("posthtml-include"),
  {
    get,
    watch
  } = require("browser-sync");

const settings = {
  server: {
    path: ".",
  },
  watch: {
    scss: "/scss/**/*.scss",
    html: "/html/**/*.html",
  },
  src: {
    path: "/src",
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
  distr: {
    path: "/distr",
    scss: "/assets/css",
    img: "/assets/img",
    fonts: "/assets/fonts",
    js: "/assets/js",
    html: "",
  }
};

const distrParallel = gulp.parallel(
  imgDistr,
  fontsDistr,
  stylesDistr,
  scriptsDistr,
  htmlDistr
);

const distr = gulp.series(cleanDistr, distrParallel);
const serve = gulp.parallel(distr, server);

function getFullPath(exPath = "", assetsPath = "") {
  return settings.server.path + exPath + assetsPath;
}

function getDistrPath(assetsPath = "") {
  return getFullPath(settings.distr.path, assetsPath);
}

function getDistrPathArray(assetsArray) {
  return assetsArray.map(m => {
    return getDistrPath(m);
  });
}

function getSrcPath(assetsPath = "") {
  return getFullPath(settings.src.path, assetsPath);
}

function getSrcPathArray(assetsArray) {
  return assetsArray.map(m => {
    return getSrcPath(m);
  });
}

function getBuildPath(assetsPath) {
  return getFullPath(settings.build.path, assetsPath);
}

function getBuildPathArray(assetsArray) {
  return assetsArray.map(m => {
    return getBuildPath(m);
  });
}

function cleanDistr() {
  return del(getDistrPathArray([
    settings.distr.scss,
    settings.distr.img,
    settings.distr.fonts,
    settings.distr.js
  ]));
}

function imgDistr() {
  return gulp.src(getSrcPath(settings.src.img))
    .pipe(gulp.dest(getDistrPath(settings.distr.img)));
}

function fontsDistr() {
  return gulp.src(getSrcPath(settings.src.fonts))
    .pipe(gulp.dest(getDistrPath(settings.distr.fonts)));
}

function stylesDistr() {
  return gulp.src(getSrcPath(settings.src.scss))
    .pipe(sass()
      .on('error', function(err) {
        console.error(err.message);
        browserSync.notify(err.message, 3000);
        this.emit('end');
      }))
    .pipe(gulp.dest(getDistrPath(settings.distr.scss)))
    .pipe(browserSync.stream());
}

function scriptsDistr() {
  return gulp.src(getSrcPath(settings.src.js), {
      sourcemaps: true
    })
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(gulp.dest(getDistrPath(settings.distr.js)));
}

function htmlDistr() {
  return gulp
    .src(getSrcPath(settings.src.html))
    .pipe(
      posthtml([
        posthtmlInclude({
          root: getSrcPath("")
        })
      ])
      .on('error', function(err) {
        console.error(err.message);
        this.emit('end');
      }))
    .pipe(gulp.dest(getDistrPath(settings.distr.html)));
}

function server() {

  return new Promise((resolve, reject) => {
    try {
      browserSync
        .init({
          server: {
            baseDir: "./",
            directory: true
          },
          watch: false,
          port: 5500,
          notify: false,
          open: true,
          startPath: getDistrPath(),
          cors: false,
          ui: false
        });
        gulp
    .watch(
      getSrcPath(settings.watch.scss),
      stylesDistr
    );
    gulp
    .watch(getSrcPathArray(
        [
          settings.watch.html,
          settings.src.img,
          settings.src.fonts,
          settings.src.js,
        ]),
      gulp.series(cleanDistr, distrParallel, refresh)
    );
      resolve()
    } catch (ex) {
      reject(ex);
    }
  });

}

function refresh() {
  return new Promise((resolve, reject) => {
    try {
      browserSync.reload();
      resolve();
    } catch (ex) {
      reject(ex);
    }
  });
}

exports.distr = distr;
exports.default = serve;
exports.serve = serve;