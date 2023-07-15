import {$path} from "./path.js";

const webpackConfig = {
	entry: $path.src.js,
	output: {
		path: $path.build.js,
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules|bower_components/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					chunks: 'initial',
					test: /node_modules|bower_components/,
					name: 'vendor',
					enforce: true,
				},
			},
		},
	},
	devtool: 'source-map',
};

export {webpackConfig}
