/// <binding ProjectOpened='watch' />
'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        watch: {
            scripts: {
                cwd: 'static/v1/Scripts',
                files: ['**/*.es6.js'],
                tasks: ['babel'],
                options: {
                    spawn: false
                }
            },
            less: {
                cwd: 'static/v1/Content',
                files: ['**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            }
        },
        babel: {
            options: {
                presets: ["es2015", "es2016", "es2017"],
                plugins: ['transform-es2015-modules-amd', require('./property-babel')],
                sourceMaps: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'static/v1/Scripts',
                    src: ['**/*.es6.js'],
                    dest: 'static/v1/Scripts',
                    rename: function (dest, src) {          // The `dest` and `src` values can be passed into the function
                        return dest + '/' + src.replace('.es6', ''); // The `src` is being renamed; the `dest` remains the same
                    }
                }]
            }
        },
        requirejs: {
            dist: {
                options: {
                    baseUrl: 'static/v1/Scripts/',
                    include: ['index', 'app', 'promise_done_polyfill', 'bootstrap'],
                    out: 'static/v1/Scripts/app-loader.min.js',
                    mainConfigFile: ['static/v1/Scripts/require-config.js', 'static/v1/Scripts/require-config.release.js'],
                    optimize: 'uglify',
                    stubModules: ['babel', 'es6'], // Stub out the modules
                    done: function (done, output) {
                        // When the build is done, check for duplicated modules
                        // in the build. They should be optimised by putting
                        // into a common build layer.
                        // Taken from: https://github.com/gruntjs/grunt-contrib-requirejs/blob/master/README.md
                        var duplicates = require('rjs-build-analysis').duplicates(output);
                        if (Object.keys(duplicates).length > 0) {
                            grunt.log.subhead('Duplicates found in requirejs build:');
                            for (var key in duplicates) {
                                grunt.log.warn(duplicates[key] + ": " + key);
                            }
                            grunt.log.error('');
                            grunt.log.error('WARNING! Build contains ' +
                                'duplicated modules! Consider adding to a ' +
                                'common bundle/layer then into exclude: ' +
                                'arrays. It could be a problem if the module ' +
                                'has internal state!');
                        }
                        else {
                            grunt.log.success("Yay! No duplicated modules found in build!");
                        }
                        done();
                    },
                }
            }
        },
        bower: {
            move: {
                dest: 'static/v1/Content/',
                js_dest: 'static/v1/Scripts/',
                options: {
                    expand: true,
                    packageSpecific: {
                        bootstrap: {
                            files: ["dist/css/bootstrap.css", "dist/fonts/*", "dist/js/bootstrap.js"]
                        },
                        canjs: {
                            files: ["amd/**"]
                        }
                        //'bootstrap-material-design': {
                        //    files: ['!**/bootstrap-material-design.css']
                        //}
                    }
                }
            }
        },
        less: {
            development: {
                //options: {
                //    paths: ['../bower_components']
                //},
                files: [
                    {
                        expand: true, // Recursive
                        cwd: "static/v1/Content", // The startup directory
                        src: ["**/*.less"], // Source files
                        dest: "static/v1/Content", // Destination
                        ext: ".css" // File extension
                    }
                ]
            }
        },
        concat: {
            minify: {
                src: ['static/v1/Content/**/*.min.css', '!static/v1/Content/styles.min.css'],
                dest: 'static/v1/Content/styles.min.css'
            }
        },
        cssmin: {
            thumbnails: {
                files: [{
                    expand: true,
                    cwd: 'static/v1/Content',
                    src: ['**/*.css', '!**/*.min.css'],//['*.css', '!*.min.css'],
                    dest: 'static/v1/Content',
                    ext: '.min.css'
                }]
            }
        },
        //cssUrlEmbed: {
        //    encodeDirectly: {
        //        options:{
        //            failOnMissingUrl: false
        //        },
        //        expand: true,
        //        cwd: 'Content',
        //        src: ['**/*.min.css'],
        //        dest: 'Content'
        //    }
        //},
        css_url_replace: {
            options: {
				staticRoot: './static'
            },
            replace: {
                expand: true,
				cwd: 'static/v1/Content',
                src: ['**/*.min.css'],
				dest: 'static/v1/Content'
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-css-url-replace');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('dev', ['bower:move']);

    grunt.registerTask('prod', ['less:development', 'cssmin:thumbnails', 'css_url_replace:replace', 'concat:minify', 'babel:dist', 'requirejs:dist']);

};
