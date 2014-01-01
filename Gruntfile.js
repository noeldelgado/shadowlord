module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dev: {
                options: {
                    httpPath: '',
                    importPath: 'source/sass/',
                    sassDir: 'source/sass/',
                    cssDir: 'source/css/',
                    imagesDir: 'assets/images/',
                    fontsDir: 'assets/fonts/',
                    outputStyle: 'expanded',
                    relativeAssets: true
                }
            },
            dist: {}
        },
        watch: {
            doc: {
                files: ['index.html'],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['source/sass/**/*.scss'],
                tasks: ['compass'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            js: {
                files: 'source/js/**/*.js',
                tasks: [],
                options: {
                    livereload: true
                }
            }
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['watch']);
};
