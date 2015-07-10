var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
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

gulp.task('build:lib', ['eslint:lib', 'clean:lib'], function() {
    return gulp.src(['src/**/*.jsx', 'src/**/*.js', '!src/**/doc/*', '!src/**/test/*'])
        .pipe(react())
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

gulp.task('build', ['build:lib', 'build:dist', 'build:doc', 'build:material']);

gulp.task('server', function() {
    var cfg = Object.create(require('./webpack/dev.config.js'));
    cfg.host='localhost';
    cfg.port=8080;
    var devServer = new WebpackDevServer(webpack(cfg), {
        contentBase: path.join('./misc'),
        publicPath: '/assets/',
        hot:true,
        noInfo:false,
        inline: true
    });
    var app = express();
    app.use('/', express['static'](path.resolve(process.cwd(), 'node_modules')));
    app.use('/assets/material-ui.js', express['static'](path.resolve(process.cwd(), 'dist/material-ui.js')));
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
