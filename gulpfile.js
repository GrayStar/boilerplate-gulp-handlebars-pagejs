var gulp = require("gulp"),
    open = require('gulp-open'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    handlebars = require('gulp-handlebars'),
    handlebarsLib = require('handlebars'),
    wrap = require('gulp-wrap'),
    declare = require('gulp-declare'),
    concat = require('gulp-concat');

var config ={
    port: 8888,
    base:'http://localhost',
    browser: 'Google Chrome'
};

gulp.task('connect', function () {
    connect.server({
        root: 'dist/',
        port: config.port,
        base: config.base,
        livereload: true,
        fallback: 'dist/index.html'
    });
});

gulp.task('open', ['connect'], function () {
    return gulp.src('dist/index.html')
        .pipe(open({
            uri: config.base + ':' + config.port,
            app: config.browser
        }));
});

gulp.task('index', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

gulp.task('templates', function(){
    return gulp.src('src/templates/**/*.hbs')
        .pipe(handlebars({
            handlebars: handlebarsLib
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'app.templates',
            noRedeclare: true
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('dist/js/lib/'))
        .pipe(connect.reload());
});

gulp.task('sass', function () {
    return gulp.src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass()
            .on('error', function(err){
                gutil.log(err);
                this.emit('end');
            }))
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie >= 11'],
            cascade: false
        }))
        .pipe(cssnano({
            autoprefixer: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(connect.reload());
});

gulp.task('scripts', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js/'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch('src/index.html', ['index']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/templates/**/*.hbs', ['templates']);
    gulp.watch('src/js/**/*.js', ['scripts']);
});

gulp.task('default', ['index', 'templates', 'sass', 'scripts', 'open'], function () {
    gulp.start('watch');
});