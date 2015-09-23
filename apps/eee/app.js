// Node modules that are used
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');

var done = false;

// Mongoose for mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:4336/group6');

// All the url route.js pages used
var routes = require('./routes/index');
var register = require('./routes/register');
var admin = require('./routes/admin');
var users = require('./routes/users');
var client = require('./routes/client');
var server = require('./routes/server');
var upload = require('./routes/upload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.set('partials', {layout: 'layout'});

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("This is a secret"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({ dest: './apps/',
  changeDest: function(dest, req, res){
    dest += req.body.folderName;
    try{
      stat = fs.statSync(dest);
    }catch(err){
      fs.mkdirSync(dest);
    }
    return dest;
  },
  rename: function (fieldname, filename) {
    return filename;
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done=true;
  }
}));

app.post('/upload', function(req, res, next) {
  if(done==true){
    console.log(req.files);
	console.log("File Uploaded");
    res.redirect('/upload?status=success');
  }
});

app.use('/', routes);
app.use('/login', routes);
app.use('/register', register);
app.use('/admin', admin);
app.use('/users', users);
app.use('/client', client);
app.use('/server', server);
app.use('/upload', upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            partials: {layout: 'layout'}
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        partials: {layout: 'layout'}
    });
});


module.exports = app;
