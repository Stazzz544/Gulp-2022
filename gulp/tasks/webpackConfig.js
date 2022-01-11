import webpackStream from "webpack-stream";
import webpack from "webpack";
//require('webpack-stream').webpack.ProvidePlugin
//import "../../node_modules/regenerator-runtime/runtime.js"; // this is equivalent to @babel/plugin-transform-runtime
//import "../../node_modules/core-js/stable.js";

export const webpackConfig = () => {
	return webpackStream({
		mode: app.isBuild ? 'production' : 'development',
		devtool: "source-map",
		output: {
			filename: 'app.min.js'
		},
		// module: {
		// 	rules: [
		// 		{
		// 			test: /\.m?js$/,
		// 			exclude: '/node_modules/',
		// 			use: {
		// 				loader: 'babel-loader',
		// 				options: {
		// 					presets: ['@babel/preset-env'],
		// 					plugins: [
		// 						[
		// 						  "@babel/plugin-transform-runtime",
		// 						  {
		// 							 "absoluteRuntime": false,
		// 							 "corejs": false,
		// 							 "helpers": false,
		// 							 "regenerator": true,
		// 							 "version": "7.0.0-beta.0"
		// 						  },
		// 						  "@babel/runtime"
		// 						]
		// 					 ]
		// 				},
		// 			}
		// 		},
		// 	],
		// },
	// 	plugins: [
	// 		new webpack.ProvidePlugin( {
	// 			'Promise': 'bluebird'
	// 		})
	//   ]
	});
};

