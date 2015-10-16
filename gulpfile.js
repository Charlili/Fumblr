var gulp = require('gulp'),
		browserify = require('browserify'),
		compass = require('gulp-compass'),
		buffer = require('gulp-buffer'),
		gutil = require('gulp-util'),
		jshint = require('gulp-jshint'),
		source = require('vinyl-source-stream'),
		sourcemaps = require('gulp-sourcemaps'),
		stylish = require('jshint-stylish'),
		uglify = require('gulp-uglify');

gulp.task('lint', function(){
	return gulp.src('js/src/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('styles', function(){
	return gulp.src('./_scss/*.scss')
		.pipe(compass({
			config_file: './config.rb',
			css: './css',
			sass: './_scss',
			environment: 'production'
		}))
		.on('error', function(err){
			gutil.log(err.message);
			gutil.beep();
			this.emit('end');
		})
		.pipe(gulp.dest('./css'))
		//.pipe(browserSync.reload({stream:true}));
});


gulp.task('scripts', function(){
	var bundler = browserify({
		entries: ['./_js/app.js'],
		debug: true
	});

	return bundler.bundle()
		.on('error', function(err) {
			gutil.log(err.message);
			gutil.beep();
			this.emit('end');
		})
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./', {
    	sourceRoot: '../'
    }))
		.pipe(gulp.dest('./js'));
});

gulp.task('watch', ['scripts','styles'], function(){
	gulp.watch(['_scss/*.scss'], ['styles']);
	gulp.watch(['_js/**/*.js','_hbs/**/*.hbs'], ['scripts']);
});