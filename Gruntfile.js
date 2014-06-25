'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
var files = [
  
]

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    planetserver: {
      scripts: 'planet/static/js',
      stylesheets: 'planet/static/css',
      images: 'planet/static/images',
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'planet/static/dist/**/*'
          ]
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            'planet/static/dist/js/{,*/}*.js',
            'planet/static/dist/css/{,*/}*.css'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'planet/templates',
            dest: 'planet/templates',
            src: ['index.tmpl.html'],
            rename: function (dest, src) {
              return dest + '/' + src.replace(/\.tmpl\.html$/, '.html');
            }
          }
        ]
      },
      dep: {
        files: [
          {
            expand: true,
            dot: true, 
            cwd: 'planet/static/extjs',
            src: ['**'],
            dest: 'planet/static/dist/js'
          },
          {
            expand: true,
            dot: true, 
            cwd: 'planet/static/js/OpenLayers',
            src: ['**'],
            dest: 'planet/static/dist/js'
          },
          {
            expand: true,
            dot: true,
            cwd: 'planet/static/images',
            src: ['**'],
            dest: 'planet/static/dist/css/images'
          }
        ]
      }
    },
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['planet/templates/index.html'],
      options: {
        root: 'planet', 
        dest: 'planet/'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['planet/templates/index.html'],
      options: {
        assetsDirs: ['planet/']
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'copy:dist',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('fix', [
    'copy:fix'
  ]);

  grunt.registerTask('default', ['build']);
};
