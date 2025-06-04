const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const newer = require('gulp-newer');
const del = require('del');

// Пути к файлам
const paths = {
  src: {
    images: 'src/images/**/*.{png,jpg,jpeg}',
  },
  dest: {
    images: 'dist/images/',
    webp: 'dist/images/webp/'
  }
};

// Очистка папки с результатами
function clean() {
  return del(['dist/images']);
}

// Оптимизация изображений
function optimizeImages() {
  return gulp.src(paths.src.images)
    .pipe(newer(paths.dest.images))
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.mozjpeg({ quality: 80, progressive: true }),
      imagemin.gifsicle(),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(paths.dest.images));
}

// Конвертация в WebP
function convertToWebp() {
  return gulp.src(paths.src.images)
    .pipe(newer({
      dest: paths.dest.webp,
      ext: '.webp'
    }))
    .pipe(webp({
      quality: 80,
      preset: 'photo',
      method: 6
    }))
    .pipe(gulp.dest(paths.dest.webp));
}

// Основные задачи
const build = gulp.series(clean, gulp.parallel(optimizeImages, convertToWebp));

// Экспорт задач
exports.clean = clean;
exports.optimize = optimizeImages;
exports.webp = convertToWebp;
exports.default = build;