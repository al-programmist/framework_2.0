"use strict";

const {src, dest} = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssBeautify = require("gulp-cssbeautify");
const stripComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const webp = require("gulp-webp");
const fs = require("fs");
const realFavicon = require("gulp-real-favicon");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const del = require("del");
const panini = require("panini");
const browserSync = require("browser-sync");
const bemValidator = require("gulp-html-bem-validator");
const picture = require('gulp-picture')

/*Paths*/
const srcPath = "src";
const buildPath = "build/";
const FAVICON_DATA_FILE = srcPath + "/favicon.json";

const path = {
  build: {
    html: buildPath,
    css: buildPath + "css/",
    js: buildPath + "js/",
    images: buildPath + "images/",
    icons: buildPath + "icon/",
    favicons: buildPath + "favicon/",
    fonts: buildPath + "fonts/",
    htaccess: buildPath,
  },

  src: {
    html: srcPath + "/*.html",
    css: srcPath + "/scss/*.scss",
    js: srcPath + "/js/*.js",
    images: srcPath + "/images/**/*",
    icons: srcPath + "/icon/**/*",
    favicons: srcPath + "/favicon/favicon.png",
    fonts: srcPath + "/fonts/*",
    htaccess: srcPath + "/.htaccess",
  },

  watch: {
    html: srcPath + "/**/*.html",
    css: srcPath + "/scss/**/*.scss",
    js: srcPath + "/js/**/*.js",
    images: srcPath + "/images/**/*",
    icons: srcPath + "/icon/**/*",
    fonts: srcPath + "/fonts/**/*",
    htaccess: srcPath + "/.htaccess",
  },

  clean: {
    html: buildPath + "*.html",
    css: buildPath + "css/",
    js: buildPath + "js/",
    images: buildPath + "images/",
    icons: buildPath + "icon/",
    fonts: buildPath + "fonts/",
    htaccess: buildPath + ".htaccess",
  },
}

const breakpoints = [
  {
    width: 576,
    rename: {
      suffix: '-576px'
    }
  }, {
    width: 768,
    rename: {
      suffix: '-768px'
    }
  },{
    width: 992,
    rename: {
      suffix: '-992px'
    }
  },{
    width: 1200,
    rename: {
      suffix: '-1200px'
    }
  },{
    width: 1400,
    rename: {
      suffix: '-1400px'
    }
  }, {
    rename: {
      suffix: '-original'
    }
  }
]

/*Tasks*/

function serve() {
  browserSync.init({
    server: {
      baseDir: buildPath
    },
    notify: false,
    open: true,
    tunnel: false,
    cors: true,
    host: "localhost",
    port: 8000,
    logPrefix: "Terminator v.3.0"
  });
}

function html() {
  panini.refresh();
  return src(path.src.html, {base: srcPath})
          .pipe(plumber())
          .pipe(panini({
            root: srcPath,
            layouts: srcPath + "/tpl/layouts/",
            partials: srcPath + "/tpl/partials/",
            data: srcPath + "/tpl/data/"
          }))
          .pipe(bemValidator())
          .pipe(picture({
            webp: true,
            breakpoints
          }))
          .pipe(dest(path.build.html))
          .pipe(browserSync.stream())
}

function css() {
  return src(path.src.css, {base: srcPath + "/scss/"})
          .pipe(sourcemaps.init())
          .pipe(plumber())
          .pipe(sass({
            sourceMap: true,
            errLogToConsole: true,
            includePaths: [__dirname + "/node_modules"]
          }))
          .pipe(autoprefixer())
          .pipe(cssBeautify())
          .pipe(dest(path.build.css))
          .pipe(cssnano({
            zIndex: false,
            discardComments: {
              removeAll: true
            }
          }))
          .pipe(stripComments())
          .pipe(rename({
            suffix: ".min",
            extname: ".css"
          }))
          .pipe(sourcemaps.write())
          .pipe(dest(path.build.css))
          .pipe(browserSync.stream())
}

function js() {
  return src(path.src.js, {base: srcPath + "/js/"})
          .pipe(sourcemaps.init())
          .pipe(plumber())
          .pipe(rigger())
          .pipe(dest(path.build.js))
          .pipe(uglify())
          .pipe(rename({
            suffix: ".min",
            extname: ".js"
          }))
          .pipe(sourcemaps.write())
          .pipe(dest(path.build.js))
          .pipe(browserSync.stream())
}

function images() {
  return src(path.src.images, {base: srcPath + "/images/"})
          .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 80, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
              plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
              ]
            })
          ]))
          .pipe(dest(path.build.images))
          .pipe(webp())
          .pipe(dest(path.build.images))
}

function icons() {
  return src(path.src.icons, {base: srcPath + "/icon/"})
          .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
              plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
              ]
            })
          ]))
          .pipe(dest(path.build.icons))
          .pipe(webp())
          .pipe(dest(path.build.icons))
}

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
function fav_generate(done) {
  realFavicon.generateFavicon({
    masterPicture: path.src.favicons,
    dest: path.build.favicons,
    iconsPath: '/favicon/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '21%'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'whiteSilhouette',
        backgroundColor: '#da532c',
        onConflict: 'override'
      },
      androidChrome: {
        pictureAspect: 'shadow',
        themeColor: '#ffffff',
        manifest: {
          name: 'Terminator',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override'
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#5bbad5'
      }
    },
    settings: {
      compression: 5,
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE

  }, function () {
    done();
  });
}

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
function favicons_inject_markups() {
  return src(path.build.html + "*.html", {base: buildPath})
          .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
          .pipe(dest(path.build.html));
}

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
async function favicons_check_update(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
}

//Copies htaccess
function htaccess() {
  return src(path.src.htaccess, {base: srcPath + "/"})
          .pipe(dest(path.build.htaccess))
          .pipe(browserSync.stream())
}

function woff() {
  return src(path.src.fonts, {base: srcPath + "/fonts/"})
          .pipe(ttf2woff())
          .pipe(dest(path.build.fonts))
}

function woff2() {
  return src(path.src.fonts, {base: srcPath + "/fonts/"})
          .pipe(ttf2woff2())
          .pipe(dest(path.build.fonts))
}

function clean() {
  const cleanPath = [
          path.clean.html,
          path.clean.css,
          path.clean.js,
          path.clean.images,
          path.clean.icons,
          path.clean.fonts,
          path.clean.htaccess,
  ];
  return del(cleanPath);
}

function watcher() {
  gulp.watch([path.watch.html], { usePolling: true }, html);
  gulp.watch([path.watch.css], { usePolling: true }, css);
  gulp.watch([path.watch.js], { usePolling: true }, js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.icons], icons);
  gulp.watch([path.watch.fonts], font);
  gulp.watch([path.watch.htaccess], { usePolling: true }, htaccess);
}


const favicon = gulp.series(
        favicons_check_update,
        fav_generate,
        favicons_inject_markups
);

const font = gulp.parallel(
        woff,
        woff2,
);

const build = gulp.series(clean, gulp.parallel(
                html,
                css,
                js,
                htaccess,
                images,
                icons,
                font,
));

const watch = gulp.series(
        build,
        gulp.parallel(
                serve,
                watcher
        )


);

exports.html = html
exports.css = css
exports.js = js
exports.icons = icons
exports.images = images
exports.woff = woff
exports.woff2 = woff2
exports.fav_generate = fav_generate
exports.favicons_inject_markups = favicons_inject_markups
exports.favicons_check_update = favicons_check_update
exports.htaccess = htaccess
exports.clean = clean
exports.serve = serve
exports.watcher = watcher
exports.watch = watch
exports.build = build
exports.font = font
exports.favicon = favicon
exports.default = watch

