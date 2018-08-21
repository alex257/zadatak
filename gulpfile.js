const gulp         = require('gulp');
      browserSync  = require('browser-sync').create();
      sass         = require('gulp-sass');
      uglify       = require('gulp-uglify');
      autoprefixer = require('gulp-autoprefixer');
      uglifycss    = require('gulp-uglifycss');
      concat       = require('gulp-concat');
      sourcemaps   = require('gulp-sourcemaps');
      rename       = require("gulp-rename");
      //imagemin     = require('gulp-imagemin');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
          }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

// Move the javascript files into /src/js folder
gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest("src/js"))
        .pipe(browserSync.stream());
});

// Static Server + watching files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./src"  
    });

    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/images/*', ['imageMin']);
    //gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/*.html', ['copyHtml']);
});

//Minify css 
gulp.task('minify-css', function () {
    return gulp.src('src/css/*.css')
      .pipe(concat('main.css'))
      .pipe(uglifycss({
        "maxLineLen": 80,
        "uglyComments": true
      }))
      .pipe(rename("main.min.css"))
      .pipe(gulp.dest('dist/css/minimize'));
  });
 

//Concat scripts & uglify minify
gulp.task('scripts', ['js'], function(){
   return gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename("main.min.js"))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js/minimize'));
  });

// Copy All HTML files
gulp.task('copyHtml', function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
  });

/*// Optimize Images
gulp.task('imageMin', () =>
	gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
);*/

gulp.task('default', ['serve', 'minify-css','scripts', 'copyHtml']);


