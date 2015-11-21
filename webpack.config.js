'use strict';
const path = require('path');
const absolute = (relPath) => path.join(__dirname, relPath);
const webpack = require('webpack');
const srcPath = absolute('./splice_ui/main.js')
const distDir = absolute('./www');
const distFilename = 'main.bundle.js';
const CONFIG = require('./build_scripts/load-config');

module.exports = {
  entry: srcPath,
  output: {
    path: distDir,
    filename: distFilename,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'components': absolute('./splice_ui/components'),
      'reducers': absolute('./splice_ui/reducers'),
      'actions': absolute('./splice_ui/actions'),
      'constants': absolute('./splice_ui/constants'),
      'pages': absolute('./splice_ui/pages'),
      'helpers': absolute('./splice_ui/helpers')
    }
  },
  devtool: 'source-map',
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({__CONFIG__: JSON.stringify(CONFIG)})
  ]
};
