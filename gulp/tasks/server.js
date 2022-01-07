export const server = (done) => {
	app.plugins.browsersync.init({
		server: {
			baseDir: `${app.path.build.html}`
		},
		notify: false,//сообщения в браузере - true
		port: 3000,
	})
}