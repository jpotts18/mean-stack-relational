module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            jade: {
                files: ['app/views/**'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['public/js/**', 'app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: ['public/css/**'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: ['gruntfile.js', 'public/js/**/*.js', 'test/mocha/**/*.js', 'test/karma/**/*.js', 'app/**/*.js']
        },
        copy: {
            options: {
                punctuation: ''
            },
            js: {
                files: [
                    {cwd: 'bower_components/angular-bootstrap', src: ['**/*.js'], dest: 'public/lib/angular-bootstrap', expand: true},
                    {cwd: 'bower_components/angular-cookies',   src: ['angular-cookies*'], dest: 'public/lib/angular-cookies',   expand: true}, 
                    {cwd: 'bower_components/angular-mocks',     src: ['**/*.js'], dest: 'public/lib/angular-mocks',     expand: true},
                    {cwd: 'bower_components/angular-resource',  src: ['angular-resource*'], dest: 'public/lib/angular-resource',  expand: true},
                    {cwd: 'bower_components/angular-route',     src: ['angular-route*'], dest: 'public/lib/angular-route',     expand: true},                    
                    {cwd: 'bower_components/angular',   src: ['angular*'], dest: 'public/lib/angular',           expand: true},
                    {cwd: 'bower_components/angular-ui-utils/demo',                      src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/demo',                         expand: true},
                    {cwd: 'bower_components/angular-ui-utils/test',                      src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/test',                         expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules',                   src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules',                      expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/event',             src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/event',                expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/format',            src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/format',               expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/highlight',         src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/highlight',            expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/ie-shiv',           src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/ie-shiv',              expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/indeterminate',     src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/indeterminate',        expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/inflector',         src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/inflector',            expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/jq',                src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/jq',                   expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/keypress',          src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/keypress',             expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/mask',              src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/mask',                 expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/reset',             src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/reset',                expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/reset/stylesheets', src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/reset/stylesheets',    expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/route',             src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/route',                expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/scrollfix',         src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/scrollfix',            expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/showhide',          src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/showhide',             expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/unique',            src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/unique',               expand: true},
                    {cwd: 'bower_components/angular-ui-utils/modules/validate',          src: ['**/*.js'], dest: 'public/lib/angular-ui-utils/modules/validate',             expand: true},
                    {cwd: 'bower_components/bootstrap/js',                               src: ['*.js'],    dest: 'public/lib/bootstrap/js', expand: true},
                    {cwd: 'bower_components/bootstrap/less',                             src: ['*.less'],  dest: 'public/lib/bootstrap/less', expand: true},
                    {cwd: 'bower_components/bootstrap/docs/assets/css',                  src: ['*.*'],    dest: 'public/lib/bootstrap/docs/assets/css', expand: true},
                    {cwd: 'bower_components/bootstrap/docs/assets/ico',                  src: ['*.*'],    dest: 'public/lib/bootstrap/docs/assets/ico', expand: true},
                    {cwd: 'bower_components/bootstrap/docs/assets/img',                  src: ['*.*'],    dest: 'public/lib/bootstrap/docs/assets/img', expand: true},
                    {cwd: 'bower_components/bootstrap/docs/assets/js',                   src: ['*.*'],    dest: 'public/lib/bootstrap/docs/assets/js', expand: true},
                    {cwd: 'bower_components/jquery',                                     src: ['jquery*'], dest: 'public/lib/jquery', expand: true},

                ]
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
                    ext: 'js',
                    watch: ['app', 'config'],
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        }
    });

    //Load NPM tasks 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-copy');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['copy', 'jshint', 'concurrent']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};