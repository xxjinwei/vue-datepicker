/**
 * @author jinwei01
 * @file gulpfile
 */
var gulp         = require('gulp')
var less         = require('gulp-less')
var comb         = require('gulp-csscomb')
var autoprefixer = require('gulp-autoprefixer')
var plumber      = require('gulp-plumber')
var notify       = require('gulp-notify')
var reporter     = require('gulp-less-reporter')
var injectHtml   = require('gulp-inject-stringified-html')
var umd          = require('gulp-umd')


// autoprefixer conf
var autoprefixerConf = {
    browsers: ['ie >= 9', 'chrome > 30', 'Safari >= 6', 'ff >= 30', 'last 2 versions']
}

// static dir
var srcDir  = 'src/'
var distDir = 'dist/'

// glob pattens
var pattens = {
    'less': [
        srcDir + '**/*.less'
    ],
    'js': [
        srcDir + '**/*.js'
    ],
    'tpl': [
        srcDir = '**/*.tpl'
    ],
    'img': ['png', 'gif', 'jpg', 'jpeg', 'webp', 'svg'].map(function (type) {
        return srcDir + '**/*.' + type
    })
}

// build css
gulp.task('build-css', function () {
    return gulp.src(pattens.less)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(less()).on('error', reporter)
        .pipe(autoprefixer(autoprefixerConf))
        .pipe(comb())
        .pipe(gulp.dest(distDir))
})

// build js
gulp.task('build-js', function () {
    return gulp.src(pattens.js)
        .pipe(injectHtml())
        .pipe(umd())
        .pipe(gulp.dest(distDir))
})

// build img
gulp.task('build-img', function () {
    return gulp.src(pattens.img)
        .pipe(gulp.dest(distDir))
})


// watch css
gulp.task('watch-css', ['build-css', 'build-img'], function () {
    gulp.watch(pattens.less, ['build-css', 'build-img'])
})

// watch js
gulp.task('watch-js', ['build-js'], function () {
    gulp.watch([pattens.js, pattens.tpl], ['build-js'])
})

gulp.task('watch', ['watch-css', 'watch-js'], function () {})
