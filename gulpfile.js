
var gulp = require('gulp'),
	mocha = require('gulp-mocha'),
	istanbul = require('gulp-istanbul'),
	jshint = require('gulp-jshint'),
	codecov = require('gulp-codecov'),
	del = require('del'),
	basename = 'swagger-poser',
	paths = {
		sources: ['lib/**/*.js'],
		tests: ['spec/*.js'],
		dist: 'browser'
	};

paths.all = paths.sources.concat(paths.tests).concat(['gulpfile.js']);

gulp.task('clean', function (cb) {
	del([
		paths.dist + '/' + basename + '.*',
		'coverage'
		], cb);
});

gulp.task('lint', function () {
	return gulp
	.src(paths.all)
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('pre-test', function () {
	return gulp.src(['lib/**/*.js'])
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
	});

gulp.task('test', ['pre-test'], function () {
	return gulp.src(['spec/*.js'], { read: false })
		.pipe(mocha())
		.pipe(istanbul.writeReports())
		.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

gulp.task('codecov', ['test'], function () {
	return  gulp.src('./coverage/lcov.info')
		.pipe(codecov());
});

gulp.task('build', function () {
});

gulp.task('default', ['clean', 'lint', 'test', 'codecov', 'build']);