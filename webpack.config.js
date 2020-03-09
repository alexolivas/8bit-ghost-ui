
const path = require('path');

module.exports = {
	entry: './src/8bit-ghost.js',
	externals: { // This is important so routing works using the main component's dependencies
		react: 'react',
		'react-dom': 'react-dom',
		'react-router-dom': 'react-router-dom',
		'react-router': 'react-router',
	},
	module: {
		rules: [
			{
				// test: /\.js$/,
				// // exclude: /node_modules/,
				// // "include": __dirname + "/app/",
				// use: {
				// 	loader: 'babel-loader',
				// 	options: {
				// 		presets: ['@babel/preset-env'],
				// 	},
				// },
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{ loader: 'sass-loader' },
				],
			},
			{
				test: /\.(png|gif|jpg|svg)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 50000,
					},
				},
			},
		],
	},
	resolve: {
		extensions: ['.scss', '.js', 'jsx', '.json', '.png', '.gif', '.jpg', '.svg'],
	},
	output: {
		path: path.resolve(__dirname, 'dist/'),
		// library: 'bv-theme',
		// publicPath: '',
		filename: 'bluvector-ui.js',
		libraryTarget: 'umd',
		// libraryTarget: 'commonjs',
	},
};