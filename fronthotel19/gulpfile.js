const gulp = require('gulp');
const purify = require('gulp-purifycss');

gulp.task('purifyCSS', () => {
  return gulp
    .src('./dist/falettis-ui/styles.*.css')
    .pipe(
      purify(['./src/app/**/*.ts', './src/app/**/*.html'], {
        info: true, // Outputs reduction information (like in the screenshot above)
        minify: true, // Minifies the files after reduction
        rejected: true, // Logs the CSS rules that were removed
        whitelist: ['aw-wizard-*', 'aside*', '*transition*', '*dimmer*', '*ui-pnotify*', '*mat-*', '*cdk-*'] // Ignored css classes
      })
    )
    .pipe(gulp.dest('./dist/falettis-ui/'));
});
