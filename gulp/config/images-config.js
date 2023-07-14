import {breakpoints} from "./breakpoints.js";

const imagesConfig = {
	breakpoints: {
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
	},

	settings: {
		quality: 100,
		// Use progressive (interlace) scan for JPEG and PNG output
		progressive: true,
		errorOnUnusedConfig: false,
		errorOnUnusedImage: false,
		errorOnEnlargement: false,
		// Strip all metadata
		withMetadata: false
	},

	compression: {
		pngquant: true,
		optipng: false,
		zopflipng: true,
		jpegRecompress: false,
		mozjpeg: true,
		gifsicle: true,
		svgo: true,
		concurrent: 10,
		quiet: false // defaults to false
	}
}

export {imagesConfig}
