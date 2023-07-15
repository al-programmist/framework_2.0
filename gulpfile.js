"use strict";

import gulp from 'gulp';
import {$path} from "./gulp/path.js";
import {breakpoints} from "./gulp/breakpoints.js";
import {reloader} from "./gulp/reloader.js";
import {faviconConfig} from "./gulp/favicon-config.js";
import {imagesConfig} from "./gulp/images-config.js";
import svgConfig from "./gulp/svg-config.js";
import {argvConfig} from "./gulp/argv-config.js";
import {webpackConfig} from "./gulp/webpack.config.js"
import {pngConfig} from "./gulp/png-config.js";
import browserSync from "browser-sync";
import {deleteSync} from "del";
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";
import realFavicon from "gulp-real-favicon";
import fs from "fs";
import responsive from "gulp-responsive";
import image from "gulp-image";
import webp from "gulp-webp";
import plumber from "gulp-plumber";
import $notify from "gulp-notify";
import $if from "gulp-if";
import $newer from "gulp-newer";
import $debug from "gulp-debug";
import $replace from "gulp-replace"
import svgmin from "gulp-svgmin";
import svgstore from "gulp-svgstore";
import spritesmith from "gulp.spritesmith";
import mergeStream from "merge-stream";
import vinylBuffer from "vinyl-buffer";
import pug from "gulp-pug";
import htmlhint from "gulp-htmlhint";
import {htmlValidator} from "gulp-w3c-html-validator";
import bemValidator from "gulp-html-bem-validator";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import cssBeautify from "gulp-cssbeautify";
import cssnano from "gulp-cssnano";
import stripComments from "gulp-strip-css-comments";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import {fileURLToPath} from "url";
import {dirname} from "path";
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

let errorHandler;
let emittyPug;

const {src, dest} = gulp;
const sass = gulpSass(dartSass);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const argv = yargs(hideBin(process.argv))
				.config(argvConfig).argv;

argv.minify = !!argv.minify;
argv.minifyHtml = argv.minifyHtml !== null ? !!argv.minifyHtml : argv.minify;
argv.minifyCss = argv.minifyCss !== null ? !!argv.minifyCss : argv.minify;
argv.minifyJs = argv.minifyJs !== null ? !!argv.minifyJs : argv.minify;
argv.minifySvg = argv.minifySvg !== null ? !!argv.minifySvg : argv.minify;

if (argv.noResponsive) argv.responsive = false;

if (argv.ci) {
	argv.cache = false;
	argv.notify = false;
	argv.open = false;
	argv.throwErrors = true;

	webpackConfig.mode = 'production';
} else {
	webpackConfig.mode = webpackConfig.mode || 'development';
}

if (argv.production) {
	argv.cache = true;
	argv.debug = true;
	argv.minifyHtml = true;
	argv.minifyCss = true;
	argv.minifyJs = true;
	argv.minifySvg = true;
	argv.notify = true;
	argv.open = false;
	argv.throwErrors = true;
	argv.robots = true;
	argv.share = true;
	argv.htaccess = true;
	argv.minify = true;
	webpackConfig.mode = 'production';
}

if (argv.throwErrors) {
	errorHandler = false;
} else if (argv.notify) {
	errorHandler = $notify.onError('<%= error.message %>');
} else {
	errorHandler = null;
}
export const config = (callback) => {
	console.log(argv)
	// console.log($path);
	// console.log(breakpoints);
	// console.log(reloader);
	// console.log(faviconConfig);
	// console.log(svgConfig);
	callback();
}

/*Tasks*/
/**
 * Копирует htaccess
 * @returns {*}
 */
const htaccess = () => {
	return src($path.src.htaccess, {base: $path.srcPath + "/environment/"})
					.pipe($if(argv.cache, $newer($path.buildPath)))
					.pipe($if(argv.debug, $debug()))
					.pipe($if(argv.htaccess, dest($path.build.htaccess)))
}
/**
 * Копирует robots
 * @returns {*}
 */
export const robots = () => {
	return src($path.src.robots, {base: $path.srcPath + "/environment/"})
					.pipe($if(argv.cache, $newer($path.buildPath)))
					.pipe($if(argv.debug, $debug()))
					.pipe($if(argv.robots, dest($path.build.robots)))
}

/**
 * Копирует фавиконки
 * @returns {*}
 */
const favicon = () => {
	return src($path.src.favcache + "/*", {base: $path.srcPath + "/favicon/generated/"})
					.pipe($if(argv.cache, $newer($path.buildPath)))
					.pipe($if(argv.debug, $debug()))
					.pipe(dest($path.build.favicons))
}

/**
 * Чистит целевую папку
 * @param done
 */
const clean = (done) => {
	deleteSync([$path.clean]);
	done();
}

/**
 * Создает пустую целевую папку, если ее нет
 * @param done
 */
const setTarget = (done) => {
	if (!fs.existsSync($path.clean)) {
		fs.mkdirSync($path.clean);
		console.log('📁  Каталог создан:', $path.clean);
	}
	done();
}

/**
 * Запуск сервера
 */
const serve = () => {
	browserSync.init(reloader);
}

/**
 * Конвертация ttf в woff
 * @returns {*}
 */
const woff = () => {
	return src($path.src.fonts, {base: $path.srcPath + "/fonts/"})
					.pipe($if(argv.cache, $newer($path.buildPath)))
					.pipe($if(argv.debug, $debug()))
					.pipe(ttf2woff())
					.pipe(dest($path.build.fonts))
}

/**
 * Конвертация ttf в woff2
 * @returns {*}
 */
const woff2 = () => {
	return src($path.src.fonts, {base: $path.srcPath + "/fonts/"})
					.pipe($if(argv.cache, $newer($path.buildPath)))
					.pipe($if(argv.debug, $debug()))
					.pipe(ttf2woff2())
					.pipe(dest($path.build.fonts))
}

/**
 * Запускает все конвертации шрифтов
 */
export const fonts = gulp.parallel(
				woff,
				woff2,
);

/**
 * Запускает обновление конфигурации фавиконок
 * @param done
 */
export const favupdate = (done) => {
	let currentVersion = JSON.parse(fs.readFileSync($path.faviconDataFile)).version;
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
	realFavicon.generateFavicon(faviconConfig, function () {
		done();
	});
}

/**
 * Обработка картинок: ресайз и переименование для разных разрешений
 * @returns {*}
 */
export const images = () => {
	return src($path.src.images, {base: $path.srcPath + "/images/"})
					.pipe($if(argv.responsive, responsive(imagesConfig.breakpoints, imagesConfig.settings)))
					.pipe(image(imagesConfig.compression))
					.pipe(dest($path.build.images))
					.pipe(webp())
					.pipe(dest($path.build.images))
					.pipe(browserSync.stream())
}

/**
 * Сжимает и переносит все иконки в отдельную папку
 * @returns {*}
 */
export const icons = () => {
	return src($path.src.icons, {base: $path.srcPath + "/icon/"})
					.pipe(image(imagesConfig.compression))
					.pipe(dest($path.build.icons))
					.pipe(webp())
					.pipe(dest($path.build.icons))
					.pipe(browserSync.stream())
}

/**
 * Собирает иконки svg в спрайт
 * @returns {*}
 */
export const spritesvg = () => {
	return src($path.src.svg, {base: $path.srcPath + "/icon/svg/"})
					.pipe(plumber({
						errorHandler,
					}))
					.pipe($if(argv.debug, $debug()))
					.pipe(svgmin(svgConfig(argv)))
					.pipe(svgstore())
					.pipe($if(!argv.minifySvg, $replace(/^\t+$/gm, '')))
					.pipe($if(!argv.minifySvg, $replace(/\n{2,}/g, '\n')))
					.pipe($if(!argv.minifySvg, $replace('?><!', '?>\n<!')))
					.pipe($if(!argv.minifySvg, $replace('><svg', '>\n<svg')))
					.pipe($if(!argv.minifySvg, $replace('><defs', '>\n\t<defs')))
					.pipe($if(!argv.minifySvg, $replace('><symbol', '>\n<symbol')))
					.pipe($if(!argv.minifySvg, $replace('></svg', '>\n</svg')))
					.pipe(rename('sprite.svg'))
					.pipe(dest($path.build.svg))
					.pipe(browserSync.stream());
}

/**
 * Собирает иконки png в спрайт
 * @returns {*}
 */
export const spritepng = () => {
	const spritesData = src($path.src.png.files, {base: $path.srcPath + "/icon/png/"})
					.pipe(plumber({
						errorHandler,
					}))
					.pipe($if(argv.debug, $debug()))
					.pipe(spritesmith(pngConfig))

	return mergeStream(
					spritesData.img
									.pipe(plumber({
										errorHandler,
									}))
									.pipe(vinylBuffer())
									.pipe(image(imagesConfig.compression))
									.pipe(webp())
									.pipe(dest($path.build.png.files)),
					spritesData.css
									.pipe(gulp.dest($path.build.png.css)),
	);

}

/**
 * Собирает html-страницы из pug
 * @returns {*}
 */
export const html = () => {
	// return src($path.src.html, {base: $path.srcPath})
	// .pipe(sourcemaps.init())
	// .pipe(plumber())
	// .pipe(pug({pretty: true}))
	// .pipe(sourcemaps.write('.'))
	// .pipe(dest($path.build.html))
	// .pipe(browserSync.stream())
}

/**
 * Универсальный валидатор для HTML. Валидация порядка атрибутов, w3c, соответствие BEM. Запускать через npm run
 * @returns {*}
 */
export const htmllint = () => {
	// return src($path.src.html, {base: $path.srcPath})
	// .pipe(plumber())
	// .pipe(pugLinter({
	// 	reporter: pugLintStylish,
	// }))
	// .pipe(pug())
	// .pipe(htmlhint('.htmlhintrc'))
	// .pipe(reporter())
	// .pipe(htmlValidator.analyzer({ignoreLevel: 'info'}))
	// .pipe(htmlValidator.reporter())
	// .pipe(bemValidator())
}

/**
 * Компиляция стилей из SCSS в CSS. Линтер запускать через npm run stylelint
 * @returns {*}
 */
export const css = () => {
	// return src($path.src.css, {base: $path.srcPath + "/scss/"})
	// .pipe(sourcemaps.init())
	// .pipe(plumber())
	// .pipe(sass({
	// 	sourceMap: true,
	// 	errLogToConsole: true,
	// 	outputStyle: "expanded",
	// 	includePaths: [__dirname + "/node_modules"]
	// })
	// 				.on('error', notifier.onError({
	// 					message: "Error: <%= error.message %>",
	// 					title: "Style Error"
	// 				})))
	// .pipe(autoprefixer())
	// .pipe(cssBeautify({
	// 	autosemicolon: true
	// }))
	// .pipe(dest($path.build.css))
	// .pipe(cssnano({
	// 	zIndex: false,
	// 	discardComments: {
	// 		removeAll: true
	// 	}
	// }))
	// .pipe(stripComments())
	// .pipe(rename({
	// 	suffix: ".min",
	// 	extname: ".css"
	// }))
	// .pipe(sourcemaps.write('.'))
	// .pipe(dest($path.build.css))
	// .pipe(browserSync.stream())
}

/**
 * Сборка всех скриптов js
 * @returns {*}
 */
export const js = () => {
	// return src($path.src.js, {base: $path.srcPath + "js/"})
	// .pipe(sourcemaps.init())
	// .pipe(plumber())
	// .pipe(rigger())
	// .pipe(dest($path.build.js))
	// .pipe(uglify())
	// .pipe(rename({
	// 	suffix: ".min",
	// 	extname: ".js"
	// }))
	// .pipe(sourcemaps.write())
	// .pipe(dest($path.build.js))
	// .pipe(browserSync.stream())
}

/**
 * Запускает слежение за выбранными каталогами
 */
const lookup = () => {
	gulp.watch([$path.watch.html], {usePolling: true}, html);
	gulp.watch($path.watch.css, {usePolling: true}, css);
	gulp.watch($path.watch.js, {usePolling: true}, js);
	gulp.watch([$path.watch.images], images);
	gulp.watch([$path.watch.icons], icons);
	gulp.watch([$path.watch.svg], sprites);
	gulp.watch([$path.watch.fonts], fonts);
	gulp.watch([$path.watch.htaccess], {usePolling: true}, htaccess);
}

export const build = gulp.series(
				clean,
				setTarget,
				htaccess,
				robots,
				fonts,
				favicon,
				icons,
				images,
				spritesvg,
				// gulp.parallel(
				// 				html,
				// 				css,
				// 				js,
				// )
);

export default gulp.series(
				build,
				gulp.parallel(
								serve,
								lookup
				)
);
