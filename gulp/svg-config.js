import path from 'path';
function svgConfig(argv) {
	return (file) => {
		const filename = path.basename(file.relative, path.extname(file.relative));
		const minify = argv.minifySvg

		return {
			multipass: true,
			full: true,
			js2svg: {
				pretty: !minify,
				indent: '\t',
			},
			plugins: [
				{
					name: 'cleanupIDs',
					params: {
						minify: true,
						prefix: `${filename}-`,
					},
				},
				'removeTitle',
				{
					name: 'removeViewBox',
					active: false,
				},
				'sortAttrs',
			],
		};
	};
}

export default svgConfig;
