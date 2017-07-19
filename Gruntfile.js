module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        qunit: {
            files: [ 'test/**/*.html', '!test/index.html', '!test/externalMacros-definitions.html' ]
        },
        watch: {
            files: [ 'js/app/*.js', 'test/js/app/*.js' ],
            tasks: [ 'browserify' ]
        },
        browserify: {
            standalone: {
                options: {
		    plugin: [
                        [ "browserify-derequire" ]
                    ],
                    browserifyOptions: {
                        standalone: 'zpt'
                    }
                },
                src: 'js/app/main.js',
                dest: 'build/standalone.js'
            },
            expressions: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/expressions.js',
                dest: 'build/expressions.js'
            },
	    errors: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/errors.js',
                dest: 'build/errors.js'
            },
            format: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/format.js',
                dest: 'build/format.js'
            },
            i18n: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/i18n.js',
                dest: 'build/i18n.js'
            },
            i18nAsync: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/i18nAsync.js',
                dest: 'build/i18nAsync.js'
            },
            jquery: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/jquery.js',
                dest: 'build/jquery.js'
            },
            jqueryPlugin: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/jqueryPlugin.js',
                dest: 'build/jqueryPlugin.js'
            },
            loops: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/loops.js',
                dest: 'build/loops.js'
            },
            nestedLoops: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/nestedLoops.js',
                dest: 'build/nestedLoops.js'
            },
            omitTag: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/omit-tag.js',
                dest: 'build/omit-tag.js'
            },
            onError: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/on-error.js',
                dest: 'build/on-error.js'
            },
            rerunMacros: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/rerunMacros.js',
                dest: 'build/rerunMacros.js'
            },
            rerunSimple: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/rerunSimple.js',
                dest: 'build/rerunSimple.js'
            },
            scope: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/scope.js',
                dest: 'build/scope.js'
            },
            statements: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/statements.js',
                dest: 'build/statements.js'
            },
            expressionTester: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'samples/js/app/expressionTester.js',
                dest: 'build/expressionTester.js'
            }
            
        },
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
                        src: ['changes.txt']
                        },
                        {
                        src: ['CONTRIBUTORS.txt']
                        },
                        {
                        src: ['Gruntfile.js']
                        }, 
                        {
                        src: ['LICENSE.txt']
                        }, 
                        {
                        src: ['package.json']
                        },
                        {
                        src: ['README.txt']
                        }, 
                        {
                        src: ['userguide.html']
                        }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-browserify');
    
    grunt.registerTask('test', ['qunit']);
    grunt.registerTask('default', ['browserify']);
};
