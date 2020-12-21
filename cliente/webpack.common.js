/* eslint-disable no-undef */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const config = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, '../servidor/publico'),
    filename: '[name].[contenthash].bundle.js'
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [ 
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(
      {
        title: 'INE5646 - App com React e Flow - Docker & Heroku',
        meta: {
          viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
        }
      }),
    new webpack.ids.HashedModuleIdsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/
      },
      {
        test: /\.css$/, use: ['style-loader', 'css-loader']
      }
    ]
  }
}

module.exports = config
