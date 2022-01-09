import webpack from "webpack-stream";

export const js = () => {
	return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'JS',
				message: "ERROR: <%= error.message %>"
			}))
		)
		.pipe(webpack({
			mode: app.isBuild ? 'production' : 'development',
			devtool:"source-map",
			output: {
				filename: 'app.min.js'
			},
			// module: {
			// 	rules: [
			// 	  {
			// 		 test: /\.m?js$/,
			// 		 exclude: /(node_modules)/,
			// 		 use: {
			// 			loader: 'babel-loader',
			// 			options: {
			// 			  presets: ['@babel/preset-env']
			// 			}
			// 		 }
			// 	  }
			// 	]
			//  },
		}))
		.pipe(app.gulp.dest(app.path.build.js))
		.pipe(app.plugins.browsersync.stream());
}