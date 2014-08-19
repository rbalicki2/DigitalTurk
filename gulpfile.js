var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-ruby-sass'),
    jsonSass = require('gulp-json-sass'),
    jade = require('gulp-jade'),
    pkg = require('./package.json'),
    wrapper = require('gulp-wrapper'),
    runSequence = require('run-sequence');

gulp.task('js-front', function() {
  return gulp
    .src(['front/src/js/vendor/**/*.js', 'front/src/js/app.js', 'front/src/js/**/*.js'])
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest('front/public/js/'));
});

gulp.task('sass', function() {
  return gulp
    .src(['front/src/variables.json', 'front/src/sass/**/*.sass'])
    .pipe(jsonSass({
      sass: true
    }))
    .pipe(concat(pkg.name + '.sass'))
    .pipe(sass())
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