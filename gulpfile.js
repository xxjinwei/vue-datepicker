/**
 * @author jinwei01
 * @file gulpfile
 */
var path         = require('path')
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

// umd conf
var umdConf = {
    dependencies: function (file) {
        return [
            {
                name  : 'vue-transfer-dom',
                amd   : './vue-transfer-dom',
                cjs   : './vue-transfer-dom',
                global: 'VueTransferDom',
                param : 'VueTransferDom'
            }
        ]
    },
    template: path.join(__dirname, 'umd-template.js')
}

// static dir
var srcDir  = 'src/'
var distDir = 'dist/'
var libDir  = 'lib/'

// glob pattens
var pattens = {
    'js'  : [srcDir + '**/*.js'],
    'less': [
        srcDir + '**/*.less'
    ],
    'tpl': [
        srcDir + '**/*.tpl'
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

var vue_define = {
    name  : 'vue',
    amd   : './vue',
    cjs   : './vue',
    global: 'Vue',
    param : 'Vue'
}

// build datepicker
gulp.task('build-picker', function () {
    return gulp.src([srcDir + 'datepicker.js'])
        .pipe(injectHtml())
        .pipe(umd({
            dependencies: function (file) {
                return [
                    vue_define,

                    {
                        name   : 'vue-transfer-dom',
                        amd    : './vue-transfer-dom',
                        cjs    : './vue-transfer-dom',
                        global : 'VueTransferDom',
                        param  : 'VueTransferDom'
                    }
                ]
            },
            exports: function (file) {
                return 'DatePicker'
            },
            template: path.join(__dirname, 'umd-template.js')
        }))
        .pipe(gulp.dest(distDir))
})

// build datepicker range
gulp.task('build-range', function () {
    return gulp.src([srcDir + 'datepicker-range.js'])
        .pipe(injectHtml())
        .pipe(umd({
            dependencies: function (file) {
                return [
                    vue_define,

                    {
                        name   : 'datepicker',
                        amd    : './datepicker',
                        cjs    : './datepicker',
                        global : 'DatePicker',
                        param  : 'DatePicker'
                    }
                ]
            },
            exports: function (file) {
                return 'DatePickerRange'
            },
            template: path.join(__dirname, 'umd-template.js')
        }))
        .pipe(gulp.dest(distDir))
})

// build
gulp.task('build-js', ['build-picker', 'build-range', 'copy2dist'], function () {})
// copy to dist
gulp.task('copy2dist', function () {
    return gulp.src(libDir + '/*').
    pipe(gulp.dest(distDir))
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
