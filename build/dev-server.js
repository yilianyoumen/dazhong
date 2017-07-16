require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var mysql = require("mysql")
var bodyparser = require("body-parser")
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)
app.use(bodyparser.urlencoded({extended:true}))

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})
var apiRoutes = express.Router()
var server = app.listen(port)
//连接数据库
var client = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"root",
    port:'3306',
    database:"student"
})
client.connect();
//添加到数据库
apiRoutes.post("/sel",function(req,res){
        client.query("select * from shopping where name = '"+req.body.name+"'and sex = '"+req.body.sex+"' and phone = '"+req.body.phone+"'and IDs = '"+req.body.IDs+"'and data = '"+req.body.data+"' and module = '"+req.body.module+"'and shopping = '"+req.body.shopping+"'",function(err,result){
          if(result!=""){
            res.send({"code":1,"msg":"查询成功！","result":result})
          }else{
          res.send({"code":0,"msg":"输入信息有误！"})  
          }
        })
})
//调用api
app.use("/api",apiRoutes)
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
