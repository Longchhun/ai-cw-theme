'use strict';

const del = require('del');
const gulp = require('gulp');
const liferayThemeTasks = require('liferay-theme-tasks');
const path = require('path');
const runSequence = require('gulp4-run-sequence');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const baseThemePath = __dirname;
const buildPath = path.join(baseThemePath, 'build');
const srcPath = path.join(baseThemePath, 'src');
const cecAllSvgPath = '/images/icons';
const minifyCSS = require('gulp-csso');
const uglify = require('gulp-uglify-es').default;
const headerComment = require('gulp-header-comment');

const svgMinConfig = file => {
	const prefix = path.basename(file.relative, path.extname(file.relative));
	return {
		plugins: [
			{
				cleanupIDs: {
					prefix: prefix + '-',
					minify: true
				}
			}
		]
	};
};

gulp.task('clean-icons', () => del(`${buildPath}${cecAllSvgPath}/*.svg`));

gulp.task(
	'compile-svgs',
	() => (
		gulp
		.src(`${srcPath}${cecAllSvgPath}/*.svg`)
		.pipe(svgmin(svgMinConfig))
		.pipe(svgstore())
		.pipe(gulp.dest(`${buildPath}${cecAllSvgPath}`))
	)
);

gulp.task(
	'minify-css',
	() => (
		gulp.src('./build/css/*.css')
			.pipe(minifyCSS())
			.pipe(gulp.dest('./build/css'))
	)
);

gulp.task(
    'update-service-worker',
    () => (
        gulp.src('./src/js/sw.js')
        .pipe(headerComment(
            `Version: ${(+new Date).toString(36)}`
        ))
        .pipe(gulp.dest('./build/js'))
    )
)

gulp.task(
	'compress',
	() => (
		gulp.src([
            './build/js/*.js'
        ])
			.pipe(uglify({ output: { comments: 'all' }}))
			.pipe(gulp.dest('./build/js'))
	)
);

liferayThemeTasks.registerTasks({
	gulp: gulp,
	hookFn: function(gulp) {
		gulp.hook('after:build:src', done =>
            runSequence('clean-icons', 'update-service-worker', done)
		);

		gulp.hook('before:build:war', done =>
            runSequence('compile-svgs', 'minify-css','compress', done)
		);
    },
    postcss: ['autoprefixer']
});
