var webpack = require('webpack');
var path = require('path');

const APP_PATH = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'www')

let ExtractTextPlugin = require('extract-text-webpack-plugin');
let extractCSS = new ExtractTextPlugin('/css/app.css');

var config = {
	entry: APP_PATH + '/main.js',
	output: {
		filename: '/js/app.js',
		path: BUILD_DIR
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loader: extractCSS.extract(['css?modules','sass'])
			}
		]
	},
	plugins: [
		extractCSS
	],
	resolve: {
		extensions: ['', '.js']
	}
}

module.exports = config;
