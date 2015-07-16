// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber')
var sprite = require('css-sprite').stream;




// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/main.scss')
        .pipe(plumber({
            errorHandler: function (err) {  
              gutil.beep();
              gutil.log( gutil.colors.red( err ) );
              this.emit('end');
            }
        }))
//        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sass({includePaths: [
            './',
            './bower_components/'
        ]}))
//        .pipe(sourcemaps.write('../css'))
        .pipe(gulp.dest('../css'))
        .pipe(minifyCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('../css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
                'bower_components/jquery/dist/jquery.js',
                'bower_components/underscore/underscore.js',
                'bower_components/backbone/backbone.js',
                'js/*.js'
            ])
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write("../js"))
        .pipe(gulp.dest('../js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../js'));
});
 
// generate sprite.png and _sprite.scss 
gulp.task('sprites', function () {
  return gulp.src('./sprites/*.png')
    .pipe(sprite({
      name: 'sprite',
      style: '_sprite.scss',
      cssPath: '../img/',
      retina: true,
      processor: 'scss'
    }))
    .pipe(gulpif('*.png', gulp.dest('../img/'), gulp.dest('scss/objects')))
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', [ 'sass', 'scripts', 'watch']);