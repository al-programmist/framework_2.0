"use strict";

import gulp from 'gulp';
import autoprefixer from "gulp-autoprefixer";
import stripComments from "gulp-strip-css-comments";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import cssnano from "gulp-cssnano";
import cssBeautify from "gulp-cssbeautify";
import rigger from "gulp-rigger";
import uglify from "gulp-uglify";
import plumber from "gulp-plumber";
import sourcemaps from "gulp-sourcemaps";
import webp from "gulp-webp";
import fs from "fs";
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";
import {deleteAsync, deleteSync} from 'del';
import panini from "panini";
import realFavicon from "gulp-real-favicon";
import browserSync from "browser-sync";
import bemValidator from "gulp-html-bem-validator";
import {htmlValidator} from 'gulp-w3c-html-validator';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import image from 'gulp-image';
import picture from 'gulp-picture';
import responsive from 'gulp-responsive';
import notifier from 'gulp-notify';


const {src, dest} = gulp;
const sass = gulpSass(dartSass);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*Paths*/
const srcPath = "src/";
const buildPath = "build/";
const FAVICON_DATA_FILE = srcPath + "favicon.json";

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
    html: srcPath + "*.html",
    css: srcPath + "scss/*.scss",
    js: srcPath + "js/*.js",
    images: srcPath + "images/**/*",
    icons: srcPath + "icon/**/*",
    favicons: srcPath + "favicon/favicon-master.png",
    favcache: srcPath + "favicon/gen/",
    fonts: srcPath + "fonts/*",
    htaccess: srcPath + ".htaccess",
  },

  watch: {
    html: srcPath + "**/*.html",
    css: srcPath + "scss/**/*.scss",
    js: srcPath + "js/**/*.js",
    images: srcPath + "images/**/*",
    icons: srcPath + "icon/**/*",
    fonts: srcPath + "fonts/**/*",
    htaccess: srcPath + ".htaccess",
  },

  clean: buildPath,
}

const breakpoints = [
  {
    width: 200,
    rename: {
      suffix: '-200px'
    }
  }, {
    width: 576,
    rename: {
      suffix: '-576px'
    }
  }, {
    width: 768,
    rename: {
      suffix: '-768px'
    }
  }, {
    width: 992,
    rename: {
      suffix: '-992px'
    }
  }, {
    width: 1200,
    rename: {
      suffix: '-1200px'
    }
  },
  {
    width: 1400,
    rename: {
      suffix: '-1400px'
    }
  },
  {
    rename: {
      suffix: '-original'
    }
  }
]

const serve = () => {
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

const htaccess = () => {
  return src(path.src.htaccess, {base: srcPath + "/"})
          .pipe(dest(path.build.htaccess))
          .pipe(browserSync.stream())
}

const favicon = () => {
  return src(path.src.favcache + "/*", {base: srcPath + "/favicon/gen/"})
          .pipe(dest(path.build.favicons))
          .pipe(browserSync.stream())
}

/*Tasks*/
const clean = (done) => {
  deleteAsync([path.clean]);
  done();
}

const woff = () => {
  return src(path.src.fonts, {base: srcPath + "/fonts/"})
          .pipe(ttf2woff())
          .pipe(dest(path.build.fonts))
}

const woff2 = () => {
  return src(path.src.fonts, {base: srcPath + "/fonts/"})
          .pipe(ttf2woff2())
          .pipe(dest(path.build.fonts))
}

const font = gulp.parallel(
        woff,
        woff2,
);

const lookup = () => {
  gulp.watch([path.watch.html], {usePolling: true}, html);
  gulp.watch([path.watch.css], {usePolling: true}, css);
  gulp.watch([path.watch.js], {usePolling: true}, js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.icons], icons);
  gulp.watch([path.watch.fonts], font);
  gulp.watch([path.watch.htaccess], {usePolling: true}, htaccess);
}

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
export const favinjectmarkups = (done) => {
  return src(path.build.html + "*.html", {base: buildPath})
          .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
          .pipe(dest(path.build.html));
}

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
export const favupdate = (done) => {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
  done();
}

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
export const favgenerate = (done) => {
  realFavicon.generateFavicon({
    masterPicture: path.src.favicons,
    dest: path.src.favcache,
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

export const html = () => {
  panini.refresh();
  return src(path.src.html, {base: srcPath})
          .pipe(plumber())
          .pipe(panini({
            root: srcPath,
            layouts: srcPath + "tpl/layouts/",
            partials: srcPath + "tpl/partials/",
            data: srcPath + "tpl/data/"
          }))
          .pipe(picture({
            webp: true,
            breakpoints
          }))
          .pipe(bemValidator())
          .pipe(htmlValidator.analyzer({ignoreLevel: 'info'}))
          .pipe(htmlValidator.reporter())
          .pipe(dest(path.build.html))
          .pipe(browserSync.stream())
}

export const css = () => {
  return src(path.src.css, {base: srcPath + "/scss/"})
          .pipe(sourcemaps.init())
          .pipe(plumber())
          .pipe(sass({
            sourceMap: true,
            errLogToConsole: true,
            outputStyle: "expanded",
            includePaths: [__dirname + "/node_modules", __dirname + "/node_modules/gerillass/scss"]
          })
          .on('error', notifier.onError({
            message: "Error: <%= error.message %>",
            title: "Style Error"
          })))
          .pipe(autoprefixer())
          .pipe(cssBeautify({
            autosemicolon: true
          }))
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

export const js = () => {
  return src(path.src.js, {base: srcPath + "js/"})
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


export const images = () => {
  return src(path.src.images, {base: srcPath + "/images/"})
          .pipe(
                  responsive({
                    '*.svg': [],
                    '**/*.jpg': [
                      {
                        width: breakpoints[0].width,
                        rename: {suffix: breakpoints[0].rename.suffix}
                      },
                      {
                        width: breakpoints[1].width,
                        rename: {suffix: breakpoints[1].rename.suffix}
                      },
                      {
                        width: breakpoints[2].width,
                        rename: {suffix: breakpoints[2].rename.suffix}
                      },
                      {
                        width: breakpoints[3].width,
                        rename: {suffix: breakpoints[3].rename.suffix}
                      },
                      {
                        width: breakpoints[4].width,
                        rename: {suffix: breakpoints[4].rename.suffix}
                      },
                      {
                        width: breakpoints[5].width,
                        rename: {suffix: breakpoints[5].rename.suffix}
                      },
                      {
                        // Compress, strip metadata, and rename original image
                        rename: {suffix: '-original'}
                      }
                    ],
                    // Resize all PNG images to be retina ready
                    '**/*.png': [
                      {
                        width: breakpoints[0].width,
                        rename: {suffix: breakpoints[0].rename.suffix}
                      },
                      {
                        width: breakpoints[1].width,
                        rename: {suffix: breakpoints[1].rename.suffix}
                      },
                      {
                        width: breakpoints[2].width,
                        rename: {suffix: breakpoints[2].rename.suffix}
                      },
                      {
                        width: breakpoints[3].width,
                        rename: {suffix: breakpoints[3].rename.suffix}
                      },
                      {
                        width: breakpoints[4].width,
                        rename: {suffix: breakpoints[4].rename.suffix}
                      },
                      {
                        width: breakpoints[5].width,
                        rename: {suffix: breakpoints[5].rename.suffix}
                      },
                      {
                        // Compress, strip metadata, and rename original image
                        rename: {suffix: '-original'}
                      }

                    ]
                  }, {
                    quality: 100,
                    // Use progressive (interlace) scan for JPEG and PNG output
                    progressive: true,
                    errorOnUnusedConfig: false,
                    errorOnUnusedImage: false,
                    errorOnEnlargement: false,
                    // Strip all metadata
                    withMetadata: false
                  })
          )
          .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: false // defaults to false
          }))
          .pipe(dest(path.build.images))
          .pipe(webp())
          .pipe(dest(path.build.images))
          .pipe(browserSync.stream())
}

export const icons = () => {
  return src(path.src.icons, {base: srcPath + "/icon/"})
          .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: false // defaults to false
          }))
          .pipe(dest(path.build.icons))
          .pipe(webp())
          .pipe(dest(path.build.icons))
          .pipe(browserSync.stream())
}

const build = gulp.series(
        clean,
        images,
        icons,
        gulp.parallel(
                html,
                css,
                js,
                htaccess,
                favicon,
                font,
        )
);

export default gulp.series(
        build,
        gulp.parallel(
                serve,
                lookup
        )
);







