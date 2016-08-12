var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')
var convict = require('./config/convict.js')

var ENDPOINTBASE = "/admin/ninkasi/"

var app = new (require('express'))()
var port = process.env.port || 8988


if (process.env.NODE_ENV != 'production') {

  var compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))

  app.get('/', function(req, res) {
    res.redirect('/admin/ninkasi/')
  })
}
app.get(ENDPOINTBASE, function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get(ENDPOINTBASE + '_health', function(req, res) {
  res.sendStatus(200)
})


if (process.env.NODE_ENV == 'production') {
  app.get(ENDPOINTBASE + "static/bundle.js", function(req, res) {
    res.sendFile(__dirname + '/admin/ninkasi/static/bundle.js')
  })
}

app.get(ENDPOINTBASE + "config/keycloak.json", function(req, res) {
  res.sendFile(__dirname + '/config/keycloak.json')
})

app.get(ENDPOINTBASE + "config.json", function(req, res) {
  var cfg = {
    nabuBaseUrl: convict.get('nabuBaseUrl'),
    mardukBaseUrl: convict.get('mardukBaseUrl')
  }
  res.send(cfg)
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    const url = process.env.NODE_ENV == 'development' ? ' ' : '/admin/ninkasi/'
    console.info("==> Listening on port %s. Open up http://localhost:%s/%s in your browser.", port, port, url)
  }
})
