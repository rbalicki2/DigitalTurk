var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-ruby-sass'),
    jsonSass = require('gulp-json-sass'),
    jade = require('gulp-jade'),
    pkg = require('./package.json'),
    wrapper = require('gulp-wrapper'),
    runSequence = require('run-sequence'),
    plumber = require('gulp-plumber'),
    pipeErrorStop = require('pipe-error-stop'),
    through2 = require('through2'),
    chalk = require('chalk');

gulp.task('js-front', function() {
  return gulp
    .src(['front/src/js/vendor/**/*.js', 'front/src/js/app.js', 'front/src/js/**/*.js'])
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest('front/public/js/'));
});

var logFile = function(name) {
  return through2.obj(function(file, encoding, done) {
    console.log(chalk.cyan('logfile ' + name))
    console.log(file.contents.toString().substring(0,100));
    this.push(file);
    done();
  });
};

gulp.task('sass', function() {
  // console.log('sass task')
  return gulp
    .src(['front/src/variables.json', 'front/src/sass/**/*.sass'])
    // .src(['front/src/sass/**/*.sass'])
    // .src(['front/src/variables.json'])
    // .pipe(plumber())
    // .pipe(logFile('1'))
    .pipe(jsonSass({
      sass: true
    }))
    .pipe(logFile('2'))
    .pipe(concat(pkg.name + '.sass'))
    // .pipe(through2.obj())
    .pipe(pipeErrorStop(logFile('loggaaahh')))
    // .pipe(pipeErrorStop(sass(), {
      // log: true
    // }))
    // .pipe(sass())
    .pipe(logFile('3'))
    .pipe(gulp.dest('front/public/stylesheets/'));
});

gulp.task('jade-views', function() {
  return gulp
    .src('front/src/jade/views/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('front/public/views/'));
});

gulp.task('jade-partials', function() {
  return gulp
    .src('front/src/jade/partials/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('front/public/partials/'));
});

gulp.task('jade-directives', function() {
  return gulp
    .src('front/src/jade/directives/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('front/public/directives/'))
    .pipe(wrapper({
      header: '<script type="text/ng-template" id="public/directives${filename}">\n',
      footer: '</script>\n'
    }))
    .pipe(concat('all.html'))
    .pipe(gulp.dest('front/public/partials/'));
});

gulp.task('watch', function() {
  gulp.watch('front/src/js/**/*.js', ['js-front']);
  gulp.watch('front/src/sass/**/*.sass', ['sass']);
  gulp.watch('front/src/jade/views/**/*.jade', ['jade-views']);
  gulp.watch('front/src/jade/partials/**/*.jade', ['jade-partials']);
  gulp.watch('front/src/jade/directives/**/*.jade', function() {
    runSequence('jade-directives', 'jade-partials');
  });
});

gulp.task('default', ['js-front','sass', 'jade-views', 'jade-directives', 'jade-partials', 'watch']);