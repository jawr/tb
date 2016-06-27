var gulp = require('gulp');
var browserify = require('browserify');
var fs = require('fs');
var del = require('del');
var sass = require('gulp-sass');
var cssmodulesify = require('css-modulesify');
var simpleVars = require('postcss-simple-vars');
var doiuse = require('doiuse');


gulp.task('app', function() {
	del(['./www/js/app.js']);

	var postCSSPlugins = [
		'postcss-modules-local-by-default',
		'postcss-modules-extract-imports',
		'postcss-modules-scope'
	];
/*
https://github.com/jonnyscholes/browserify-gulp-react-demo/blob/master/gulpfile.js
		simpleVars({
			variables: cssVariables
		}),
		doiuse({
			browsers:['ie >= 9', '> 1%', 'last 2 versions'],
			onFeatureUsage: function(usageInfo) {
				logStatsPretty(usageInfo.message);
			}
		})
	];
*/

	return browserify('./src/main.js')
	.transform('babelify', {
		presets: ['es2015', 'react'],
		plugins: ['transform-class-properties']
	})
	.external(require.resolve('react-router'))
	.external(require.resolve('react'))
	.external(require.resolve('flux-react'))
	.external(require.resolve('moment'))
	.external(require.resolve('normalize'))
	.external(require.resolve('react-leaflet'))
	.plugin('css-modulesify', {
		o: 'www/css/gen.css',
		use: postCSSPlugins
	})
	.bundle(function(err, app) {
		fs.writeFile('./www/js/app.js', app);
	});
});

gulp.task('common', function() {
	del(['./www/js/common.js']);
	return browserify()
	.require(require.resolve('react'), { expose: 'react' })
	.require(require.resolve('react-router'), { expose: 'react-router' })
	.require(require.resolve('flux-react'), { expose: 'flux-react' })
	.require(require.resolve('moment'), { expose: 'moment' })
	.require(require.resolve('normalize'), { expose: 'normalize' })
	.require(require.resolve('react-leaflet'), { expose: 'react-leaflet' })
	.bundle(function(err, libs) {
		fs.writeFile('./www/js/common.js', libs);
	});
});

gulp.task('watch', function() {
	gulp.watch('./src/**/*.js', ['app']);
});

gulp.task('sass', function () {
    gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./www/css'));
});

gulp.task('default', ['watch', 'app', 'common', 'sass']);
