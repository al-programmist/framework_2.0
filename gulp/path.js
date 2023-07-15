const buildPath = 'build/';
const srcPath = 'src/';

const $path = {
    srcPath: srcPath,
    buildPath: buildPath,
    faviconDataFile: srcPath + "favicon/favicon.json",
    clean: buildPath,

    build: {
      html: buildPath,
      css: buildPath + "css/",
      js: buildPath + "js/",
      images: buildPath + "images/",
      icons: buildPath + "icon/",
      svg: buildPath,
      png: {
				files: buildPath,
				css: srcPath + "scss/base/"
			},
      favicons: buildPath + "favicon/",
      fonts: buildPath + "fonts/",
			robots: buildPath,
      htaccess: buildPath,
    },

    src: {
      html: [srcPath + "pages/*.pug", srcPath + "*.pug",],
      css: [srcPath + "scss/*.scss", '!' + srcPath + "scss/_*.scss"],
      js: srcPath + "js/main.js",
      images: srcPath + "images/**/*",
      icons: srcPath + "icon/**/*",
      svg: srcPath + "icon/**/*.svg",
      png: {
				files: srcPath + "icon/**/*.png",
				retinaSrcFilter: srcPath + 'icon/png/*@2x.png',
				cssTemplate: srcPath + 'scss/base/_sprite.hbs',
			},
      favicons: srcPath + "favicon/favicon-master.png",
      favcache: srcPath + "favicon/generated/",
      fonts: srcPath + "fonts/*",
      htaccess: srcPath + "environment/.htaccess",
			robots: srcPath + "environment/robots.txt",
			share: srcPath + "environment/shareSettings.php",
    },

    watch: {
      html: srcPath + "**/*.pug",
      css: [srcPath + "scss/**/*.scss", srcPath + "blocks/**/*.scss"],
      js: [srcPath + "js/**/*.js", srcPath + "blocks/**/*.js"],
      images: srcPath + "images/**/*",
      icons: srcPath + "icon/**/*",
      svg: srcPath + "icon/**/*",
      fonts: srcPath + "fonts/**/*",
      htaccess: srcPath + ".htaccess",
    }
}

export {$path}
