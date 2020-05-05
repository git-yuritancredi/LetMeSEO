const exec  = require('child_process').exec;
const gulp  = require('gulp');
const babel = require('gulp-babel');
const css   = require('gulp-clean-css');

function buildHtml(){
    return gulp.src('components/index.html').pipe(gulp.dest('app/'));
}

function buildCss(){
    return gulp.src('components/**/*.css').pipe(
        css()
    ).pipe(
        gulp.dest('app/')
    );
}

function buildJs(){
    return gulp.src(
        [
            'components/index.js',
            'components/**/*.js'
        ]
    ).pipe(
        babel()
    ).pipe(
        gulp.dest('app/')
    );
}

function watchChanges(){
    return gulp.watch(['components/**/*.js', 'components/index.css'], () => {
        buildCss();
        buildJs();
        buildHtml();
        watchChanges();
    });
}

gulp.task('html', () => {
    return buildHtml();
});

gulp.task('css', () => {
    return buildCss();
});

gulp.task('js', () => {
    return buildJs();
});

watchChanges();

gulp.task('start', gulp.series('html', 'css', 'js', () => {
    return exec(
        __dirname + '/node_modules/.bin/electron .'
    ).on('close', () => process.exit());
}));