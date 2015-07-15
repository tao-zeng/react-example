var gulp = require('gulp'),
  through = require('through2'),
  gutil = require('gulp-util'),
  path = require('path'),
  fs = require('fs'),
  mfs = require('memory-fs'),
  express = require('express'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  clean = require('gulp-clean'),
  eslint = require('gulp-eslint'),
  sourcemaps = require('gulp-sourcemaps'),
  react = require('gulp-react'),
  webpack = require('webpack'),
  gulpWebpack = require('gulp-webpack'),
  WebpackDevServer = require('webpack-dev-server');

gulp.task('build:material', function() {
  var cfg = require('./webpack/material-ui.config.js');
  fs.exists('./dist/' + cfg.output.filename, function(ret) {
    if (!ret) {
      gulp.src('./')
        .pipe(gulpWebpack(cfg))
        .pipe(gulp.dest('./dist'))
        .pipe(rename(cfg.output.filename.replace(/.js$/, '.min.js')))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
    }
  });
});

gulp.task('build:react', function() {
  var cfg = require('./webpack/react.config.js');
  fs.exists('./dist/' + cfg.output.filename, function(ret) {
    if (!ret) {
      gulp.src('./')
        .pipe(gulpWebpack(cfg))
        .pipe(gulp.dest('./dist'))
        .pipe(rename(cfg.output.filename.replace(/.js$/, '.min.js')))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
    }
  });
});

gulp.task('eslint', function() {
  return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('eslint:lib', function() {
  return gulp.src(['src/**/*.js', 'src/**/*.jsx', '!src/**/docs/*', '!src/**/test/*'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('eslint:doc', function() {
  return gulp.src(['src/**/doc/*.js', 'src/**/doc/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('clean:lib', function() {
  return gulp.src('./lib')
    .pipe(clean());
});

gulp.task('clean:doc', function() {
  return gulp.src('./doc')
    .pipe(clean());
});

gulp.task('clean:dist', function() {
  return gulp.src(['dist/**', '!dist/material-ui*'])
    .pipe(clean());
});

function caseModuleName(name) {
  name = name.replace(/[^a-zA-Z0-9][a-z]?/g, function(w) {
    if (w.length === 1) {
      return '';
    }
    return w[1].toUpperCase();
  });
  return name.substr(0, 1).toUpperCase() + name.substr(1);
}
function moduleIndex(output) {
  return through.obj(function(dir, e, c) {
    var modules = [];
    fs.readdirSync(dir.path).filter(function(file) {
      var fileName;
      if (fs.statSync(path.join(dir.path, file)).isDirectory()) {
        fileName = file;
      } else {
        fileName = file.substr(0, file.lastIndexOf('.'));
      }
      modules.push('\t' + caseModuleName(fileName) + ': require("./' + file + '/' + file + '")');
    });
    var contents = 'module.exports={\n' + modules.join(',\n') + '\n};\n';

    var f = new gutil.File({
      base: './',
      path: './' + (output || 'index.js'),
      contents: new Buffer(contents),
    });
    gutil.log(contents);
    this.push(f);
    c();
  });
}
gulp.task('build:lib', ['eslint:lib'], function() {
  gulp.src(['src/**/*.jsx', 'src/**/*.js', '!src/**/doc/*', '!src/**/test/*'])
    .pipe(react())
    .pipe(gulp.dest('lib'));
  gulp.src('./src')
    .pipe(moduleIndex())
    .pipe(gulp.dest('lib'));
});

gulp.task('build:doc', ['eslint:doc', 'clean:doc'], function() {
  return gulp.src(['src/**/doc/*.js', 'src/**/doc/*.jsx'])
    .pipe(react())
    .pipe(gulp.dest('doc'));
});

gulp.task('build:dist', [], function() {
  var cfg = require('./webpack/config.js');
  return gulp.src('./')
    .pipe(gulpWebpack(cfg))
    .pipe(gulp.dest('./dist'))
    .pipe(rename(cfg.output.filename.replace(/.js$/, '.min.js')))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', ['clean:dist', 'clean:lib', 'clean:doc']);

gulp.task('build', ['build:lib', 'build:doc', 'build:dist', 'build:react', 'build:material']);

gulp.task('server', ['build'], function() {
  var cfg = Object.create(require('./webpack/dev.config.js'));
  cfg.host = 'localhost';
  cfg.port = 8080;
  var devServer = new WebpackDevServer(webpack(cfg), {
    contentBase: path.join('./misc'),
    publicPath: '/assets/',
    hot: true,
    noInfo: false,
    inline: true
  });
  var app = express();
  app.use('/', express['static'](path.resolve(process.cwd(), 'node_modules')));
  app.use('/assets/material-ui.js', express['static'](path.resolve(process.cwd(), 'dist/material-ui.js')));
  app.use('/assets/react.js', express['static'](path.resolve(process.cwd(), 'dist/react.js')));
  //app.use('/scripts/react/', express['static'](path.join(process.cwd(), 'node_modules/react/dist')));

  app.use(devServer.app);
  var listeningApp = app.listen(cfg.port, cfg.host, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log('Listening at port ' + cfg.port);
  });
  var socketio = require('webpack-dev-server/node_modules/socket.io');
  devServer.io = socketio.listen(listeningApp, {
    "log level": 2
  });
  devServer.io.sockets.on("connection", function(socket) {
    if (this.hot) socket.emit("hot");
    if (!this._stats) return;
    this._sendStats(socket, devServer._stats.toJson());
  }.bind(devServer));
});

gulp.task('default', ['build']);



