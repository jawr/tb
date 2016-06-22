var gulp = require('gulp');
var browserify = require('browserify');
var fs = require('fs');
var del = require('del');
var reactify = require('reactify');

gulp.task('app', ['clean'], function() {
	return browserify('./src/main.js')
	.transform(reactify)
	.external(require.resolve('react-router'))
	.external(require.resolve('react'))
	.external(require.resolve('flux-react'))
	.external(require.resolve('moment'))
	.external(require.resolve('underscore'))
	.external(require.resolve('spin'))
	.external(require.resolve('react-loader'))
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
	.require(require.resolve('underscore'), { expose: 'underscore' })
	.require(require.resolve('spin'), { expose: 'spin' })
	.require(require.resolve('react-loader'), { expose: 'react-loader' })
	.require(require.resolve('react-google-maps'), { expose: 'react-google-maps' })
	.bundle(function(err, libs) {
		fs.writeFile('./www/js/common.js', libs);
	});
});

gulp.task('clean', function(done) {
	del(['./www/js/app.js'], done);
});

gulp.task('watch', function() {
	gulp.watch('./src/**/*.js', ['app']);
});

gulp.task('default', ['watch', 'app', 'common']);
