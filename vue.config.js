const webpack = require('webpack')
const path = require('path')
const appData = require('./src/datas/mer_list.json')
const mers = appData.mers

function resolve(dir) {
  
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: path.join(__dirname, 'social'),
  
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },
  devServer: {
    before(app) {
      app.post('/sales/getproductlist', function (req, res) {
        res.json({
          errno: 0,
          data: mers
        })
      })
      
    }
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))

    config.plugin('context')
      .use(webpack.ContextReplacementPlugin,
        [/moment[/\\]locale$/, /zh-cn/])
  },
  baseUrl: ''
}
