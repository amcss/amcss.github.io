var gulp        = require('gulp');
var ghPages     = require('gulp-gh-pages');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var harp        = require('harp');

/**
 * Serve the Harp Site from the src directory
 */
gulp.task('serve', function () {
  harp.server(__dirname + '/src', {
    port: 9001
  }, function () {
    browserSync({
      port: 3001,
      proxy: "localhost:9001",
      open: false,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });
    /**
     * Watch for scss changes, tell BrowserSync to refresh main.css
     */
    gulp.watch("src/**/*.scss", function () {
      reload("main.css", {stream: true});
    });
    /**
     * Watch for all other changes, reload the whole page
     */
    gulp.watch(["src/**/*.jade", "src/**/*.json", "src/**/*.md"], function () {
      reload();
    });
  })
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the harp site, launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);

gulp.task('build-release', function (done) {
  harp.compile('src', __dirname + '/dist', done);
});
gulp.task('publish', ['build-release'], function () {
  return gulp.src("./dist/**/*")
    .pipe(ghPages({
      branch: "master",
      cacheDir: ".publish"
    }))
});
