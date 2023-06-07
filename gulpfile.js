"use strict";

import gulp from 'gulp';
import {path} from "./gulp/config/path.js";
import {breakpoints} from "./gulp/config/breakpoints.js";
import {reloader} from "./gulp/config/reloader.js";
import {faviconConfig} from "./gulp/config/favicon-config.js";
import {imagesConfig} from "./gulp/config/images-config.js";
import {spriteConfig} from "./gulp/config/sprite-config.js";
import browserSync from "browser-sync";
import {deleteAsync} from "del";
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";
import realFavicon from "gulp-real-favicon";
import fs from "fs";
import responsive from "gulp-responsive";
import image from "gulp-image";
import webp from "gulp-webp";
import plumber from "gulp-plumber";
import svgSprite from "gulp-svg-sprite";
import notifier from "gulp-notify";
import pugLinter from "gulp-pug-linter";
import pugLintStylish from "puglint-stylish";
import pug from "gulp-pug";
import htmlhint from "gulp-htmlhint";
import reporter from "gulp-reporter";
import {htmlValidator} from "gulp-w3c-html-validator";
import bemValidator from "gulp-html-bem-validator";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import cssBeautify from "gulp-cssbeautify";
import cssnano from "gulp-cssnano";
import stripComments from "gulp-strip-css-comments";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import {fileURLToPath} from "url";
import {dirname} from "path";
import rigger from "gulp-rigger";
import uglify from "gulp-uglify";


const {src, dest} = gulp;
const sass = gulpSass(dartSass);
const __path = path();
const __breakpoints = breakpoints();
const __reloader = reloader(__path.buildPath);
const __faviconConfig = faviconConfig();
const __imagesConfig = imagesConfig();
const __spriteConfig = spriteConfig();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = (callback) => {
  console.log(__path);
  console.log(__breakpoints);
  console.log(__reloader);
  console.log(__faviconConfig);
  console.log(__spriteConfig);
  callback();
}

/*Tasks*/

const htaccess = () => {
  return src(__path.src.htaccess, {base: __path.srcPath + "/"})
          .pipe(dest(__path.build.htaccess))
  // .pipe(browserSync.stream())
}

const favicon = () => {
  return src(__path.src.favcache + "/*", {base: __path.srcPath + "/favicon/generated/"})
          .pipe(dest(__path.build.favicons))
  // .pipe(browserSync.stream())
}

const clean = (done) => {
  deleteAsync([__path.clean]);
  done();
}

const serve = () => {
  browserSync.init(__reloader);
}

const woff = () => {
  return src(__path.src.fonts, {base: __path.srcPath + "/fonts/"})
          .pipe(ttf2woff())
          .pipe(dest(__path.build.fonts))
}

const woff2 = () => {
  return src(__path.src.fonts, {base: __path.srcPath + "/fonts/"})
          .pipe(ttf2woff2())
          .pipe(dest(__path.build.fonts))
}

const font = gulp.parallel(
        woff,
        woff2,
);

/**
 * Запускает слежение за выбранными каталогами
 */
const lookup = () => {
  gulp.watch([__path.watch.html], {usePolling: true}, html);
  gulp.watch(__path.watch.css, {usePolling: true}, css);
  gulp.watch(__path.watch.js, {usePolling: true}, js);
  gulp.watch([__path.watch.images], images);
  gulp.watch([__path.watch.icons], icons);
  gulp.watch([__path.watch.svg], sprites);
  gulp.watch([__path.watch.fonts], font);
  gulp.watch([__path.watch.htaccess], {usePolling: true}, htaccess);
}

/**
 * Запускает обновление конфигурации фавиконок
 * @param done
 */
export const favupdate = (done) => {
  let currentVersion = JSON.parse(fs.readFileSync(__path.faviconDataFile)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
  done();
}

/**
 * Генерирует иконки, занимает время. Запустить только один раз перед началом проекта. Запускать только после ручного обновления конфигурации фавиконок
 * @param done
 */
export const favgenerate = (done) => {
  realFavicon.generateFavicon(__faviconConfig, function () {
    done();
  });
}

/**
 * Обработка картинок: ресайз и переименование для разных разрешений
 * @returns {*}
 */
export const images = () => {
  return src(__path.src.images, {base: __path.srcPath + "/images/"})
          .pipe(responsive(__imagesConfig.breakpoints, __imagesConfig.settings))
          .pipe(image(__imagesConfig.compression))
          .pipe(dest(__path.build.images))
          .pipe(webp())
          .pipe(dest(__path.build.images))
          .pipe(browserSync.stream())
}

/**
 * Сжимает и переносит все иконки в отдельную папку
 * @returns {*}
 */
export const icons = () => {
  return src(__path.src.icons, {base: __path.srcPath + "/icon/"})
          .pipe(image(__imagesConfig.compression))
          .pipe(dest(__path.build.icons))
          .pipe(webp())
          .pipe(dest(__path.build.icons))
          .pipe(browserSync.stream())
}

/**
 * Собирает иконки в спрайт
 * @returns {*}
 */
export const sprites = () => {
  let config = spriteConfig();

  return src(__path.src.svg, {base: __path.srcPath + "/icon/"})
          .pipe(plumber())
          .pipe(svgSprite(config))
          .on('error', notifier.onError({
            message: "Error: <%= error.message %>",
            title: "Spite creation error"
          }))
          .pipe(dest(__path.build.svg))
          .pipe(browserSync.stream())
}

/**
 * Собирает html-страницы из pug
 * @returns {*}
 */
export const html = () => {
  return src(__path.src.html, {base: __path.srcPath})
          .pipe(sourcemaps.init())
          .pipe(plumber())
          .pipe(pug({pretty: true}))
          .pipe(sourcemaps.write('.'))
          .pipe(dest(__path.build.html))
          .pipe(browserSync.stream())
}

/**
 * Универсальный валидатор для HTML. Валидация порядка атрибутов, w3c, соответствие BEM. Запускать через npm run
 * @returns {*}
 */
export const htmllint = () => {
  return src(__path.src.html, {base: __path.srcPath})
          .pipe(plumber())
          .pipe(pugLinter({
            reporter: pugLintStylish,
          }))
          .pipe(pug())
          .pipe(htmlhint('.htmlhintrc'))
          .pipe(reporter())
          .pipe(htmlValidator.analyzer({ignoreLevel: 'info'}))
          .pipe(htmlValidator.reporter())
          .pipe(bemValidator())
}

/**
 * Компиляция стилей из SCSS в CSS. Линтер запускать через npm run stylelint
 * @returns {*}
 */
export const css = () => {
  return src(__path.src.css, {base: __path.srcPath + "/scss/"})
          .pipe(sourcemaps.init())
          .pipe(plumber())
          .pipe(sass({
            sourceMap: true,
            errLogToConsole: true,
            outputStyle: "expanded",
            includePaths: [__dirname + "/node_modules"]
          })
                  .on('error', notifier.onError({
                    message: "Error: <%= error.message %>",
                    title: "Style Error"
                  })))
          .pipe(autoprefixer())
          .pipe(cssBeautify({
            autosemicolon: true
          }))
          .pipe(dest(__path.build.css))
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
          .pipe(sourcemaps.write('.'))
          .pipe(dest(__path.build.css))
          .pipe(browserSync.stream())
}

/**
 * Сборка всех скриптов js
 * @returns {*}
 */
export const js = () => {
  return src(__path.src.js, {base: __path.srcPath + "js/"})
          .pipe(sourcemaps.init())
          .pipe(plumber())
          .pipe(rigger())
          .pipe(dest(__path.build.js))
          .pipe(uglify())
          .pipe(rename({
            suffix: ".min",
            extname: ".js"
          }))
          .pipe(sourcemaps.write())
          .pipe(dest(__path.build.js))
          .pipe(browserSync.stream())
}
