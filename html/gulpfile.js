var gulp = require('gulp');
var browserify = require('browserify');
var fs = require('fs');
var del = require('del');

gulp.task('app', function() {
	del(['./www/js/app.js']);
	return browserify('./src/main.js')
	.transform("babelify", {presets: ["es2015", "react"]})
	.external(require.resolve('react-router'))
	.external(require.resolve('react'))
	.external(require.resolve('flux-react'))
	//.external(require.resolve('moment'))
	.external(require.resolve('react-google-maps'))
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
	//.require(require.resolve('react-google-maps'), { expose: 'react-google-maps' })
	.bundle(function(err, libs) {
		fs.writeFile('./www/js/common.js', libs);
	});
});

gulp.task('watch', function() {
	gulp.watch('./src/**/*.js', ['app']);
});

gulp.task('default', ['watch', 'app', 'common']);
