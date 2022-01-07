//основной модуль
import gulp from "gulp";

//импорт путей
import { path } from "./gulp/config/path.js";

//ипорт общих плагинов
import { plugins } from "./gulp/config/plugins.js"

//передаём значения в глобальную переменную
global.app = {
	isBuild: process.argv.includes('--build'),
	isDev: !process.argv.includes('--build'),
	path: path,
	gulp: gulp,
	plugins: plugins,
}

//ипорт задач
import { copy } from "./gulp/tasks/copy.js"
import { reset } from "./gulp/tasks/reset.js"
import { html } from "./gulp/tasks/html.js"
import { server } from "./gulp/tasks/server.js"
import { scss } from "./gulp/tasks/scss.js"
import { js } from "./gulp/tasks/js.js"
import { images } from "./gulp/tasks/images.js"
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js"


//наблюдатель за изменениями в файлах
function watcher() {
	//                путь      задача
	gulp.watch(path.watch.files, copy);
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.images, images);
}

//последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

//основные задачи
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, images)); //параллельные действия

//построение сценариев
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server)); // последовательный метод слева на право
const build = gulp.series(reset, mainTasks);

//экспорт сценариев
export { dev }
export { build }

//выполнение сценария по умолчанию
gulp.task('default', dev);