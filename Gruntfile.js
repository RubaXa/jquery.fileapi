'use strict';

module.exports = function (grunt){
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: ['jquery.fileapi.js'],

			options: {
				  curly:	true	// + "Expected '{' and instead saw 'XXXX'."
				, immed:	true
				, latedef:	true
				, newcap:	true	// "Tolerate uncapitalized constructors"
				, noarg:	true
				, sub:		true
				, undef:	true
				, unused:	true
				, boss:		true
				, eqnull:	true

				, node:			true
				, es5:			true
				, expr:			true // - "Expected an assignment or function call and instead saw an expression."
				, supernew:		true // - "Missing '()' invoking a constructor."
				, laxcomma:		true
				, laxbreak:		true
				, smarttabs:	true
			}
		},

		qunit: {
			options: {
				files: {
					  'one': ['tests/files/image.jpg']
					, 'multiple': ['tests/files/1px.gif', 'tests/files/hello.txt', 'tests/files/image.jpg', 'tests/files/dino.png', 'tests/files/lebowski.json']
				}
			},
			all: ['tests/*.html']
		},

		version: {
			src: ['<%= pkg.name %>.js', 'bower.json']
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> - <%= pkg.license %> | <%= pkg.repository.url %> */\n'
			},
			dist: {
				files: {
					'<%= pkg.name %>.min.js': ['<%= pkg.main %>']
				}
			}
		}
	});


	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Load custom QUnit task, based on grunt-contrib-qunit, but support "files" option.
	grunt.loadTasks('./tests/grunt-task/');

	// "npm test" runs these tasks
	grunt.registerTask('test', ['jshint', 'qunit']);


	grunt.registerTask('build', ['version', 'uglify']);

	// Default task.
	grunt.registerTask('default', ['test', 'build']);
};
