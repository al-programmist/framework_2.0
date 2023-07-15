import {$path} from "./path.js";

const pngConfig = {
	cssName: '_sprite.scss',
	cssTemplate: $path.src.png.cssTemplate,
	imgName: 'sprite.png',
	retinaImgName: 'sprite@2x.png',
	retinaSrcFilter: $path.src.png.retinaSrcFilter,
	padding: 2,
}

export {pngConfig}
