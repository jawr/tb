var webpack = require('webpack');
var path = require('path');

const APP_PATH = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'assets');
const PUBLIC_DIR = '/assets/';

let ExtractTextPlugin = require('extract-text-webpack-plugin');
// for dist todo later extractCSS('css?modules....')
//
//let extractCSS = new ExtractTextPlugin('/css/app.css');

var config = {
	entry: [
		'webpack-dev-server/client?http://jess.lawrence.pm:3000',
		'webpack/hot/only-dev-server',
		APP_PATH + '/main.js'
	],
	output: {
		filename: '/js/app.js',
		path: BUILD_DIR,
		publicPath: PUBLIC_DIR
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['react-hot', 'babel']
			},
			{
				test: /\.scss$/,
				exclude: /(node_modules|assets\/css)/,
				loaders: ['style-loader', 'css?modules&localIdentName=[path][name]---[local]', 'sass']
			}
		]
	},
	plugins: [
		// dev extractCSS,
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	resolve: {
		extensions: ['', '.js']
	},
	devServer: {
		hot: true,
		historyApiFallback: false,
		quiet: false,
		watchOptions: {
			aggregateTimeout: 100
		}
	}
}

module.exports = config;
