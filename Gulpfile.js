var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserify  = require('browserify'),
    wiredep     = require('wiredep').stream;



gulp.task('sass', function() {
   gulp.src('scss/app.scss')
       //.pipe(wiredep())
       .pipe(sass())
       .pipe(gulp.dest('public/css'))
});


gulp.task('watch', function() {
   gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('build' , [
   'sass'
]);

gulp.task('default', ['build', 'watch']);