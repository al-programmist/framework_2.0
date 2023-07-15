import {$path} from "./path.js";

const faviconConfig = {
	masterPicture: $path.src.favicons,
	dest: $path.src.favcache,
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
	markupFile: $path.faviconDataFile
}

export {faviconConfig}
