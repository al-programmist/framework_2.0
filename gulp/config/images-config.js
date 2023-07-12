import {breakpoints} from "./breakpoints.js";
const __breakpoints = breakpoints();

export function imagesConfig() {
  return {
    breakpoints: {
      '*.svg': [],
      '**/*.jpg': [
        {
          width: __breakpoints[0].width,
          rename: {suffix: __breakpoints[0].rename.suffix}
        },
        {
          width: __breakpoints[1].width,
          rename: {suffix: __breakpoints[1].rename.suffix}
        },
        {
          width: __breakpoints[2].width,
          rename: {suffix: __breakpoints[2].rename.suffix}
        },
        {
          width: __breakpoints[3].width,
          rename: {suffix: __breakpoints[3].rename.suffix}
        },
        {
          width: __breakpoints[4].width,
          rename: {suffix: __breakpoints[4].rename.suffix}
        },
        {
          width: __breakpoints[5].width,
          rename: {suffix: __breakpoints[5].rename.suffix}
        },
        {
          // Compress, strip metadata, and rename original image
          rename: {suffix: '-original'}
        }
      ],
      // Resize all PNG images to be retina ready
      '**/*.png': [
        {
          width: __breakpoints[0].width,
          rename: {suffix: __breakpoints[0].rename.suffix}
        },
        {
          width: __breakpoints[1].width,
          rename: {suffix: __breakpoints[1].rename.suffix}
        },
        {
          width: __breakpoints[2].width,
          rename: {suffix: __breakpoints[2].rename.suffix}
        },
        {
          width: __breakpoints[3].width,
          rename: {suffix: __breakpoints[3].rename.suffix}
        },
        {
          width: __breakpoints[4].width,
          rename: {suffix: __breakpoints[4].rename.suffix}
        },
        {
          width: __breakpoints[5].width,
          rename: {suffix: __breakpoints[5].rename.suffix}
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
}
