const exec      = require('child_process').exec;
const fs        = require('fs');
const gulp      = require('gulp');
const babel     = require('gulp-babel');
const css       = require('gulp-clean-css');

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

function cleanBuild(done){
    if(fs.existsSync(__dirname+ "/app")){
        fs.rm(__dirname+ "/app", {
            recursive: true
        }, () => {
            done();
        });
    }
}

async function start() {
    return exec("DEVELOPMENT=1 "+__dirname + '/node_modules/.bin/electron .').on('exit', () => {
        process.exit(0);
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

gulp.task('watch', () => {
    return gulp.watch(['components/**/*.js', 'components/index.css', 'components/index.js'], gulp.parallel('build', 'watch'));
});

gulp.task('start', () => {
    return start();
});

gulp.task('clean', (done) => {
    return cleanBuild(done);
});

gulp.task('build', gulp.parallel('html', 'css', 'js'));
gulp.task('rebuild', gulp.series('clean', 'build'));
gulp.task('run', gulp.series('build', 'start', 'watch'));
