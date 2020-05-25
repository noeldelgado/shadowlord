const { src, dest, parallel, watch } = require('gulp'),
  rollup          = require('gulp-better-rollup'),
  babel           = require('rollup-plugin-babel'),
  sass            = require('gulp-sass'),
  autoprefixer    = require('gulp-autoprefixer'),
  uglify          = require('gulp-uglify-es').default,
  connect         = require('gulp-connect'),
  rootImport      = require('rollup-plugin-root-import'),
  nodeResolve     = require('rollup-plugin-node-resolve'),
  commonjs        = require('rollup-plugin-commonjs');

sass.compiler = require('sass');

const serverTask = (done) => {
  connect.server({
    root: '',
    host: '0.0.0.0',
    livereload: true
  });
  done();
};

const stylesTask = () => src('src/sass/app.scss')
  .pipe(sass({
    includePaths: [
      'node_modules',
      require('path').resolve(__dirname, 'node_modules')
    ]
  }))
  .pipe(autoprefixer('last 2 version'))
  .pipe(dest('dist/css'))
  .pipe(connect.reload());

const scriptsTask = () => src('src/javascripts/index.js')
  .pipe(rollup({
    rollup: require('rollup'),
    // There is no `input` option as rollup integrates into the gulp pipeline
    plugins: [
      nodeResolve({
        mainFields: ['module', 'main', 'browser']
      }),
      commonjs({
        include: [/node_modules/]
      }),
      rootImport({
        root: `src/javascripts`,
        extensions: '.js'
      }),
      babel()
    ]
  }, {
    // Rollups `sourcemap` option is unsupported. Use `gulp-sourcemaps` plugin instead
    format: 'umd',
  }))
  .pipe(dest('dist/js'))
  .pipe(connect.reload());

const htmlTask = () => src('*.html').pipe(connect.reload());

const watchTask = (done) => {
  watch('*.html', htmlTask);
  watch('src/javascripts/**', scriptsTask);
  watch('src/sass/**', stylesTask);
  done();
};

const stylesDist = () => src('dist/css/app.css')
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(dest('dist/css'));

const scriptsDist = () => src('dist/js/index.js')
  .pipe(uglify())
  .pipe(dest('dist/js/'));

exports.default = parallel(watchTask, serverTask);
exports.build = parallel(stylesDist, scriptsDist);
