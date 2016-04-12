var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config.dev.js');
config.devtool=undefined
config.entry = [
  path.join(__dirname, 'src/index.js')
]
config.plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
]
module.exports = config