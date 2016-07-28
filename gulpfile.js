var gulp        = require("gulp"),
    browserify  = require("browserify"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    sourcemaps  = require("gulp-sourcemaps"),
    uglify      = require("gulp-uglify"),
    runSequence = require("run-sequence"),
    browserSync = require('browser-sync').create();

gulp.task("lint", function() {
    return gulp.src([
        "src/**/**.ts"
    ])
    .pipe(tslint({
        formatter: "verbose"
    }))
    .pipe(tslint.report());
});

var tsProject = tsc.createProject("tsconfig.json");

gulp.task("build", function() {
    return gulp.src([
            "src/**/**.ts"
        ])
        .pipe(tsc(tsProject))
        .js.pipe(gulp.dest("src/"));
});

gulp.task("bundle", function() {

    var libraryName = "app";
    var mainTsFilePath = "src/main.js";
    var outputFolder   = "dist/";
    var outputFileName = libraryName + ".min.js";

    var bundler = browserify({
        debug: true,
        standalone : libraryName
    });

    return bundler.add(mainTsFilePath)
        .bundle()
        .pipe(source(outputFileName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputFolder));
});

gulp.task('copy-lib', function () {
  return gulp
    .src('node_modules/phaser/build/phaser.min.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-assets', function () {
  return gulp
    .src('src/assets/**')
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('copy-index', function () {
  return gulp
    .src('src/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task("watch", ["default"], function () {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch([ "src/**/**.ts"], ["default"]);
    gulp.watch("dist/*.js").on('change', browserSync.reload); 
});

gulp.task("default", function (cb) {
    runSequence("lint", "build", "bundle", "copy-lib", "copy-assets", "copy-index", cb);
});