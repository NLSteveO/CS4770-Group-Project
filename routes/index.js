var express = require('express');
var router = express.Router();
var User = require('../models/usersModel');

/* GET login page. */
router.get('/', function(req, res, next) {
  var nav = [ 
    {item : '<a href="/admin" id="current">HOME</a>'},
    {item : '<a href="/server" id="server">SERVER</a>'},
    {item : '<a href="/client" id="client">CLIENT</a>'},
    {item : '<a href="/upload" id="apps">APPS</a>'}
  ]
  res.render('index', { nav: nav, title: 'Login', partials: {layout: 'layout'} });
});

// POST user login info to check against database
router.post('/', function(req, res, next) {
  var user = req.body.user;
  var pass = req.body.pass;
  User.findOne({Username: user, Password: pass}, function(err, User) {
    if (err) res.send("oh look an error: " + err);
    if (User === null) res.sendStatus(401); // Oh look wrong login
    else{
      res.cookie('Sim', User.Sim, {signed: true});
      res.json(User);
    }
  });
});

module.exports = router;
