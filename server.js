/**
 * Module dependencies.
 */
var express = require('express');
var connFu = require('connfu');

var app = module.exports = express.createServer();

/**
 * Express Configuration
 */
app.configure('development', function(){
  app.use(require("./jadeify")({
    jsFile: '/javascripts/jade.tmpl.js',
    tmplFolder: __dirname + '/views/templates',
    publicFolder: __dirname + '/public'
  }));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require("stylus").middleware({
    src: __dirname + "/public",
    compress: false
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('production', function(){
 app.use(express.errorHandler()); 
});

/**
 * Global vars (to mantain state)
 */
var Backend = require('./backend');

app.get('/', function(req, res){
  res.render('index', {param1: 'lalala'});
});

app.listen(12110);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
