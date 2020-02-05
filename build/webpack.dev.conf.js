'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
//const baseWebpackConfig = require('./webpack.base.conf')
const baseWebpackConfig = require('./webpack.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
//const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const path = require('path')
const appData = require('../src/datas/mer_list.json')
const mers = appData.mers

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    contentBase: path.resolve(__dirname,'./social'),
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    //publicPath: config.dev.assetsPublicPath,
   publicPath: './',
   
    proxy: config.dev.proxyTable,
    quiet: false, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
  
    before(app) {
      console.log('==>app:'+app)
      console.log(mers)
      console.log('=>config.dev.assetsPublicPath:'+ config.dev.assetsPublicPath)
      app.post('/sales/getproductlist', function (req, res) {
        res.json({
          errno: 0,
          data: mers
        })
      })
      
    }
  }
  
})


module.exports = devWebpackConfig
