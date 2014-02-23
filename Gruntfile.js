module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass : {
            dev : {
                options : {
                    httpPath    : '',
                    importPath  : 'source/sass/',
                    sassDir     : 'source/sass/',
                    cssDir      : 'source/css/',
                    imagesDir   : 'assets/images/',
                    fontsDir    : 'assets/fonts/',
                    outputStyle : 'expanded',
                    relativeAssets: true
                }
            }
        },

        watch : {
            doc: {
                files: ['source/index.html'],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['source/sass/**/*.scss'],
                tasks: ['compass'],
                options: {
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
        },

        useminPrepare: {
            html: 'source/index.html',
            options: {
                dest: 'dist'
            }
        },
        usemin: {
            html: ['index.html'],
        },

        copy : {
            copyHTML : {
                src     : 'source/index.html',
                dest    : 'index.html'
            }
        },

        replace: {
            livereload_script : {
                src: ['index.html'],
                overwrite: true,
                replacements: [{
                    from:  /<script (src="\/\/[\w\:\/\.\"\>]+)<\/script>/g,
                    to: ''
                }]
            },
            css_path: {
                src: ['index.html'],
                overwrite: true,
                replacements: [{
                    from: /<link ((?:[-a-z]+="[^"]*"\s*)+)\/>/g,
                    to  : '<link rel="stylesheet" href="dist/css/styles.css" media="all"/>'
                }]
            },
            js_path: {
                src: ['index.html'],
                overwrite: true,
                replacements: [{
                    from: /<script ((?:[-a-z]+="[^"]*"\s*)+)><\/script>/g,
                    to  : '<script src="dist/js/app.js"></script>'
                }]
            }
        }
    });

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('dist', ['copy', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin', 'replace']);
};
