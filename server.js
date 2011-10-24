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
  
  // Expose flash messages to the views
  app.dynamicHelpers({ messages: require('express-messages') });
  
  // Expose all the session params to the views
  app.dynamicHelpers({
    session: function (req, res) {
      return req.session;
    }
  });
});

app.configure('production', function(){
 app.use(express.errorHandler()); 
});

/**
 * Global vars (to mantain state)
 */
var Backend = require('./models/backend');

app.get('/', function(req, res) {
  Backend.Snippet.findRecent(10, function(err, data){
    res.render('index', {recentSnippets: data});
  });
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  
  Backend.User.register(req.body.username, req.body.password, req.body.email, function(err, data){
    if (err) {
      req.flash('error', err);
      res.render('signup');
    } else {
      // Store user into session
      req.session.user = data;
      req.flash('info', 'You have registered successfully');
      res.redirect('/');
    }
  });
});

app.get('/logout', function(req, res){
  req.session.user = null;
  req.flash('info', 'You have logged out successfully');
  res.redirect('/');
});

app.post('/login', function(req, res){
  Backend.User.authenticate(req.body.username, req.body.password, function(err, data){
    if (err) {
      req.flash('error', err);
      res.redirect('/');
    } else {
      // Store user into session
      req.session.user = data;
      req.flash('info', 'You have logged in successfully');
      res.redirect('/');
    }
  });
});

app.get('/snippet/:id', function(req, res){
  Backend.Snippet.findById(req.params.id, function(err, data){
    if (err) {
      req.flash('error', err);
      res.redirect('/');
    } else if (data === null){
      req.flash('error', 'This Snippet does not exist');
      res.redirect('/');
    } else {
      console.log(data);
      res.render('snippet', {snippet: data});
    }
  });
});

app.listen(12110);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
