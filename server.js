var fs = require('fs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var devConfig = require('./webpack.config.dev');
// var connectToDB = require('./server/connectToDB');
//var bodyParser = require('body-parser');
var forceSSL = require('force-ssl');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');
var http = require('http');
var https = require('https');

var methodOverride = require('method-override');

var logger = require('morgan');
var cookieParser = require('cookie-parser');

var app = express();




var routes = require('./server/routes/index');

var app = express();

app.use(methodOverride());
app.use(logErrors);
// app.use(clientErrorHandler);
// app.use(errorHandler);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//set up routes
app.use('/api', routes);

app.config = JSON.parse(fs.readFileSync('./server-config.json', 'utf8'));

//connect to the db, then start the server
// connectToDB(app,startServer);
startServer()

function startServer() {
  var compiler = webpack(devConfig);
  app.use(bodyParser.json());

  if (process.env.NODE_ENV !== 'production') {
    //setup the webpack dev server
    var middleware = require('webpack-dev-middleware')(compiler, {
      // noInfo: true,
      // quiet: true,
      stats: 'errors-only',
      publicPath: devConfig.output.publicPath
    })
    app.use(middleware);
    app.use(require('webpack-hot-middleware')(compiler));
  }
  app.use(express.static(__dirname + '/server/resources'));
  app.use(express.static(__dirname + '/server/static'));

  app.use(express.static(__dirname + '/dist'));
  app.use(express.static(__dirname));

  try {

    var ssl_options = {
      key: fs.readFileSync('./private.key', 'utf8'),
      cert: fs.readFileSync('./certificate.pem', 'utf8'),
      ca: [
         fs.readFileSync('./chain1.pem','utf8'),
         fs.readFileSync('./chain2.pem','utf8')
      ]
    };
     
    var server = http.createServer(app);
    var secureServer = https.createServer(ssl_options, app);
      
    console.log("SSL ENABLED");

    secureServer.listen(3443,function(){
      console.log("Listening port 3443");
    });
    server.listen(3005,function(){
      console.log("Listening port 3005");
    });
     
  }
  catch(e){
    //console.log(e);
    console.log("SSL keys not available, starting in port 3005");
    app.listen(3005,function(){
      console.log('Dev-server listening at http://localhost:3005');
    });
  }
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}