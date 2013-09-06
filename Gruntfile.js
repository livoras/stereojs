module.exports = function (grunt) {
	grunt.initConfig({

		watch: {
			files: ['src/**/*'],
			tasks: ['concat:stereo']
		},

		concat: {
			options: {
				separator: '\n\n'
			},

			stereo: {
				src: ['src/intro.js', 'src/events.js', 'src/stereo.js', 'src/outro.js'],
				dest: 'dist/stereo.js'	
			}
		},

		gcc: {
			stereo: {
				src: ['dist/stereo.js'],
				dest: 'dist/stereo.min.js'
			}
		}

	}); 

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-gcc');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['concat:stereo', 'gcc:stereo']);

    grunt.event.on('watch', function (action, filename) {
    	grunt.log.writeln(action + ' ' + filename);
    });

};
