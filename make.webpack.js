module.exports = function(option) {
  var cfg = {
    entry: option.entry,
    output: {
      publicPath: option.publicPath,
      path: option.output.replace(/[\\/][^\\/]*$/, ''),
      filename: option.output.replace(/.*[\\/]/, ''),
      library: option.library,
      libraryTarget: 'umd'
    },
    externals: {},
    addExternal: function(path, lib, root) {
      if (Array.isArray(path)) {
        for (var i = 0; i < path.length; i++) {
          this.addExternal(path[i].path, path[i].lib, path[i].root);
        }
      } else {
        this.externals[path] = {
          root: root,
          commonjs: lib,
          commonjs2: lib,
          amd: lib
        }
      }
      return this;
    },
    resolve: {
      modulesDirectories: ['node_modules'],
      extensions: ['', '.js', '.jsx']
    },
    devtool: option.devtool,
    stats: {
      colors: true,
      reasons: false
    },
    module: {
      loaders: [option.hot ? {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: option.hot ? 'react-hot!babel' : 'babel'
      } : {
        test: /\.(js|jsx)$/,
        loader: 'babel'
      }]
    },
    plugins: option.plugins || []
  }
  if (option.externals) {
    cfg.addExternal(option.externals);
  }
  return cfg;
}
