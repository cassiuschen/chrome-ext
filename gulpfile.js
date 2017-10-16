let gulp = require('gulp'),
	slim = require('gulp-slim'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	minify = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	connect = require('gulp-connect'),
	open = require('gulp-open'),
	uglify = require('gulp-uglify'),
	liveload = require('gulp-livereload'),
	scss = require('gulp-sass'),
	del = require('del'),
	refresh = require('gulp-refresh')

let paths = {
	'views': 'src/views/*.slim',
	'style': 'src/stylesheets/*.scss',
	'scripts': 'src/javascripts/*.js'
}

gulp.task('default', [
	'generate',
	'watch',
	'server',
	'open'
])

gulp.task('views', () =>
	gulp.src(paths.views)
		.pipe(slim({
			'pretty': true,
			'options': "encoding='utf-8'"
		}))
		.pipe(gulp.dest('app'))
)

gulp.task('scripts', () =>
	gulp.src(paths.scripts)
		.pipe(gulp.dest('app/js'))
)

gulp.task('styles', () =>
	gulp.src(paths.style)
		.pipe(autoprefixer({
			'browsers': ['last 5 Chrome versions', 'iOS > 0', 'Android > 0', '> 5%'],
			'cascade': true,
			'remove': true
		}))
		.pipe(scss())
		.pipe(concat('app.css'))
		.pipe(gulp.dest('app/css'))
)

gulp.task('generate', [
	'views',
	'scripts',
	'styles'
])

gulp.task('open', () =>
	gulp.src('app/index.html')
		.pipe(open('', {'url': 'http://127.0.0.1:9527'}))
)

gulp.task('clean', (callback) =>
	del(['app/js/*.js', 'app/css/*.css', 'app/*.html'], callback)
)

gulp.task('server', ['generate'], () =>
    connect.server({
        root: [ 'app' ],
        livereload: true
    })
)

gulp.task('reload', ['clean', 'generate'])
gulp.task('renew', () => refresh())

gulp.task('watch', function() {
	refresh.listen()
	gulp.watch(paths.style, ['styles', 'renew'])
	gulp.watch(paths.scripts, ['scripts', 'renew'])
	gulp.watch(paths.views, ['views', 'renew'])
})

gulp.task('pack', function() {

	gulp.src('manifest.json')
		.pipe(gulp.dest('package'))

	gulp.src('assets/**/*.*')
		.pipe(gulp.dest('package/assets'))

	gulp.src(paths.views)
		.pipe(slim({
			'pretty': true,
			'options': "encoding='utf-8'"
		}))
		.pipe(gulp.dest('package'))

	gulp.src(paths.style)
		.pipe(autoprefixer({
			'browsers': ['last 5 Chrome versions', 'iOS > 0', 'Android > 0', '> 5%'],
			'cascade': true,
			'remove': true
		}))
		.pipe(scss())
		.pipe(concat('app.css'))
		.pipe(minify())
		.pipe(gulp.dest('package/css'))

	gulp.src(paths.scripts)
		.pipe(uglify())
		.pipe(gulp.dest('package/js'))

	notify({ 'message': 'Chrome 插件打包完成' })
})