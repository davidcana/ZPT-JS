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
                    plugin: 
                        [ 
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
            macros: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/macros.js',
                dest: 'build/macros.js'
            },
            externalMacros: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/externalMacros.js',
                dest: 'build/externalMacros.js'
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
            i18nAsyncAuto: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/i18nAsyncAuto.js',
                dest: 'build/i18nAsyncAuto.js'
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
            query: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/query.js',
                dest: 'build/query.js'
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
            multiroot: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/multiroot.js',
                dest: 'build/multiroot.js'
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
            original: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/original.js',
                dest: 'build/original.js'
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
            },
            recursiveMacros: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'samples/js/app/recursiveMacros.js',
                dest: 'build/recursiveMacros.js'
            },
            mixedMacros: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'samples/js/app/mixedMacros.js',
                dest: 'build/mixedMacros.js'
            },
            externalMacrosAbsoluteURLs: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/externalMacros-absoluteURLs.js',
                dest: 'build/externalMacros-absoluteURLs.js'
            },
            externalMacrosPrefixURLs: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/externalMacros-prefixURLs.js',
                dest: 'build/externalMacros-prefixURLs.js'
            },
            singleRoot: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/singleRoot.js',
                dest: 'build/singleRoot.js'
            },
            dictionaryExtension: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/dictionaryExtension.js',
                dest: 'build/dictionaryExtension.js'
            },
            folderDictionaries: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/folderDictionaries.js',
                dest: 'build/folderDictionaries.js'
            },
            folderDictionaries2: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/folderDictionaries2.js',
                dest: 'build/folderDictionaries2.js'
            },
            declare: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/declare.js',
                dest: 'build/declare.js'
            },
            update: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/js/app/update.js',
                dest: 'build/update.js'
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
        },
        uglify: {
            standalone: {
                files: {
                    'build/standalone.min.js': [ 'build/standalone.js' ]
                }
            }
        },
        copy: {
            standalone: {
                src: 'build/standalone.js',
                dest: 'docs/lib/zpt.js'
            },
            standaloneMin: {
                src: 'build/standalone.min.js',
                dest: 'docs/lib/zpt.min.js'
            }
        },
        jshint: {
            all: [ 'Gruntfile.js', 'js/app/*.js', 'test/js/app/*.js' ],
            options: {
                jshintrc: '.jshintrc'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    
    grunt.registerTask('test', ['qunit']);
    grunt.registerTask('default', ['browserify']);
    grunt.registerTask('updateWeb', ['browserify:standalone', 'uglify', 'copy:standaloneMin', 'copy:standalone']);
};
