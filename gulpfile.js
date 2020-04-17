var { src, dest, parallel, watch }= require('gulp'),
    sass            = require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify-es').default,
    livereload      = require('gulp-livereload'),
    connect         = require('gulp-connect')

sass.compiler = require('sass');

const serverTask = (done) => {
    connect.server({
        root: '',
        livereload: true
    });
    done();
}

const stylesTask = () => src('src/sass/app.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 2 version'))
    .pipe(dest('dist/css'))
    .pipe(connect.reload());

const scriptsTask = () => src([
    'node_modules/neon/neon.js',
    'node_modules/neon/stdlib/**',
    'node_modules/values.js/index.js',
    'src/javascripts/lib/**',
    'src/javascripts/ui/**',
    'src/javascripts/app/**',
    'src/javascripts/app.js'
])
    .pipe(concat('app.js'))
    .pipe(dest('dist/js'))
    .pipe(connect.reload());

const htmlTask = () => src('*.html').pipe(connect.reload());

const watchTask = (done) => {
    watch('*.html', htmlTask);
    watch('src/javascripts/**', scriptsTask);
    watch('src/sass/**', stylesTask);
    done();
}

const stylesDist = () => src('dist/css/app.css')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(dest('dist/css'));

const scriptsDist = () => src('dist/js/app.js')
    .pipe(uglify())
    .pipe(dest('dist/js/'));

exports.default = parallel(watchTask, serverTask);
exports.build = parallel(stylesDist, scriptsDist);
