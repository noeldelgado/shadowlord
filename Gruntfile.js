module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'source/sass',
                    src: ['*.scss'],
                    dest: 'source/css',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            options: {
            },
            dev: {
                expand: true,
                flatten: true,
                src: 'source/css/**/*.css',
                dest: 'source/css/'
            },
        },

        watch : {
            options : {livereload : 9000},
            doc: {
                files: ['source/index.html'],
                tasks: []
            },
            css: {
                files: ['source/sass/**/*.scss'],
                tasks: ['sass', 'autoprefixer']
            },
            js: {
                files: 'source/js/**/*.js',
                tasks: []
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
                    from: /<link ((?:[-a-z]+="[^"]*"\s*)+)\/?>/g,
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

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('dist', ['copy', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin', 'replace']);
};
