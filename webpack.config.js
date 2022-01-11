module.exports = {
	// entry: './index.js',
	// output: { 
	//   filename: '[name].js' 
	// },

	plugins: [
		new webpack.ProvidePlugin({
			'Promise': 'bluebird'
	  }),
	]
 };