module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        compress: {
            main: {
                options: {
                    archive: 'dist/<%= pkg.name %>-js_<%= grunt.template.today("yyyy-mm-dd_HHMM") %>.tar.gz',
                    pretty: true
                },
                expand: true,
                files: [
                    {
                        cwd: 'test/',
                        expand: true,
                        src: ['**/*', '!**/*~'],
                        dest: 'test'
                    }, 
                    {
                        cwd: 'samples/',
                        expand: true,
                        src: ['**/*', '!**/*~'],
                        dest: 'samples'
                    }, 
                    {
                        cwd: 'js/',
                        expand: true,
                        src: ['**/*', '!**/*~'],
                        dest: 'js'
                    },
                    {
                        cwd: 'docs/',
                        expand: true,
                        src: ['**/*', '!**/*~'],
                        dest: 'docs'
                    },
                    {
                        src: ['changes.txt']
                    },
                    {
                        src: ['CONTRIBUTORS.txt']
                    },
                    {
                        src: ['Gruntfile.js']
                    }, 
                    {
                        src: ['LICENSE']
                    }, 
                    {
                        src: ['package-lock.json']
                    },
                    {
                        src: ['package.json']
                    },
                    {
                        src: ['README.md']
                    }
                ]
            }
        },
        copy: {
            update_ZPT_in_docs: {
                src: 'dist/zpt-esm.js',
                dest: 'docs/lib/zpt-esm.js'
            }
        },
        jshint: {
            all: [ 'Gruntfile.js', 'js/app/*.js', 'test/js/app/*.js' ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        exec: {
            check_node: 'node samples/js/app/node.js'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');
};
