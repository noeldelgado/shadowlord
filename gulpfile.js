var gulp            = require('gulp'),
    sass            = require('gulp-ruby-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify')
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
            style: 'compressed'
        }))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('scripts', function() {
    return gulp.src([
        'bower_components/neon/neon.js',
        'bower_components/neon/stdlib/node_support.js',
        'bower_components/neon/stdlib/custom_event.js',
        'bower_components/neon/stdlib/custom_event_support.js',
        'bower_components/neon/stdlib/node_support.js',
        'bower_components/values.js/index.js',
        'src/javascripts/lib/**',
        'src/javascripts/ui/**',
        'src/javascripts/app/**',
        'src/javascripts/app.js'
        ])
        .pipe(concat('app.js'))
        .pipe(uglify())
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
