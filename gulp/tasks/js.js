import { webpackConfig } from "./webpackConfig.js"

export const js = () => {
	return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'JS',
				message: "ERROR: <%= error.message %>"
			}))
		)
		.pipe(webpackConfig())
		.pipe(app.gulp.dest(app.path.build.js))
		.pipe(app.plugins.browsersync.stream());
}