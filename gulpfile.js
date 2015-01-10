var gulp            = require('gulp'),
    sass            = require('gulp-ruby-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    concat          = require('gulp-concat'),
    livereload      = require('gulp-livereload'),
    connect         = require('gulp-connect')

gulp.task('connect', function() {
    connect.server({
        root: '',
        livereload: true
    });
});

gulp.task('styles', function() {
    return gulp.src('src/sass/app.scss')
        .pipe(sass({
            style: 'expanded'
        }))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('scripts', function() {
    return gulp.src([
        'src/javascripts/vendor/neon.js',
        'src/javascripts/vendor/neon-stdlib/**',
        'src/javascripts/vendor/values.min.js',
        'src/javascripts/lib/**',
        'src/javascripts/ui/**',
        'src/javascripts/app/**',
        'src/javascripts/app.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

gulp.task('markup', function() {
    return gulp.src('*.html')
        .pipe(connect.reload());
});

gulp.task('watch', ['connect'], function() {
    gulp.watch('*.html', ['markup'])
    gulp.watch('src/javascripts/**', ['scripts'])
    gulp.watch('src/sass/**', ['styles'])
});

gulp.task('default', ['watch']);
