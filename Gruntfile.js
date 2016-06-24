module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    nodemon: {
      dev: {
        script: 'server/server.js',
        options: {
          ignore: ['node_modules'],
          watch: ['server'],
          delay: 1000,
        }
      }
    },

    clean: {
      js: ['./build/*.js'],
      css: ['./build/*.css'],
      index: ['./build/*.html'],
    },

    copy: {
      index: {
        files: [
          {expand: true, flatten: true, src: './app/index.html', dest: './build/'}
        ]
      },
    },

    watch: {
    }

  });

  // Load in Grunt Dependencies
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('server-dev', function(target) {

    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon',
      opts: {
        stdio: 'inherit',
      },
    }, function(err, result, code) {
      if (err) {
        console.log(err);
      }
    });

    grunt.task.run(['watch']);

  });

  grunt.registerTask('build', function(n) {
    grunt.task.run(['copy']);
  });

  grunt.registerTask('upload', function(n) {
    grunt.task.run(['build']);
    grunt.task.run(['server-dev']);
  });

  grunt.registerTask('deploy', 'Sets up Dev Env', [
    'clean',
    'upload'
  ]);



};