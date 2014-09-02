module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ['public/javascripts/dist/*', 'public/stylesheets/dist/*'],

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: [
					{
	          expand: true, 
	          cwd: 'public/javascripts/dev/',   
	          src: ['*.js', '!*.min.js'],
	          dest: 'public/javascripts/dist/',  
	          ext: '.js',
	          extDot: 'first' 
	        }
	      ]
			}
		},

		copy: {
			main: {
				expand: true,
		    cwd: 'public/javascripts/dev/',
		    src: '*.min.js',
		    dest: 'public/javascripts/dist/',
		    flatten: true,
		    filter: 'isFile',
			}
		},

		cssmin: {
			minify: {
		  	expand: true,
		    cwd: 'public/stylesheets/dev/',
		    src: ['*.css', '!*.min.css'],
		    dest: 'public/stylesheets/dist',
		    ext: '.css'
  		}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['clean', 'uglify', 'copy', 'cssmin']);
};