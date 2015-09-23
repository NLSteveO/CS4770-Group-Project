var express = require('express');
var router = express.Router();
var User = require('../models/usersModel');
var Network = require('../models/networksModel');

/* GET client registration page. */
router.get('/client', function(req, res, next) {
  var nav = [ 
    {item : '<a href="/admin" id="home">HOME</a>'},
    {item : '<a href="/server" id="server">SERVER</a>'},
    {item : '<a href="/client" id="current">CLIENT</a>'},
    {item : '<a href="/upload" id="apps">APPS</a>'}
  ];
  if (req.query != null) {
    if (req.query.sim != null) {
      Network.find({Sim: req.query.sim}, function(err, networks) {
        if (err) res.send("oh look an error: " + err);
        res.render('register', { sims: {Token: req.query.sim}, network: networks, email: req.query.email, token: req.query.token, client: true, nav: nav, title: 'Client Registration', partials: {layout: 'layout'} });
      });
    }
    else {
      User.find({Type: "admin"}, function(err, users) {
        if (err) res.send("oh look an error: " + err);
        res.render('register', { sims: users, email: req.query.email, token: req.query.token, client: true, nav: nav, title: 'Client Registration', partials: {layout: 'layout'} });
      });
    }
  }
  else {
    User.find({Type: "admin"}, function(err, users) {
      if (err) res.send("oh look an error: " + err);
      res.render('register', { sims: users, client: true, nav: nav, title: 'Client Registration', partials: {layout: 'layout'} });
    });
  }
});

/* GET admin registration page. */
router.get('/admin', function(req, res, next) {
  var nav = [ 
    {item : '<a href="/admin" id="current">HOME</a>'},
    {item : '<a href="/server" id="server">SERVER</a>'},
    {item : '<a href="/client" id="client">CLIENT</a>'},
    {item : '<a href="/upload" id="apps">APPS</a>'}
  ]
  // Generate an admin token and make sure it is not in use.
  var num = Math.floor(Math.random() * 99999)+"";
  while (num.length < 5) num = "0" + num;
  var token = 'a'+num;
  var query = User.where('Token').equals(token);
  console.log(token);
  query.findOne(function(err, User) {
    console.log(User);
    if (err) res.send("oh look an error: " + err);
    if (User != null) {
      res.redirect('/register/admin');
    }
    else if (User == null) {
      // Render page with token autofilled
      res.render('register', {token: token, nav: nav, title: 'Admin Registration', partials: {layout: 'layout'} });
    }
   });
});

/* POST client registration page. */
router.post('/client/new', function(req, res, next) {
  User.findOne({Sim: req.body.Sim, Email: req.body.Email, Token: req.body.Token}, function(err, user) {
	if (err) res.send("oh look an error: " + err);
	if (user != null) {
      user.Name = req.body.Name;
	  user.Username = req.body.Username;
      user.Password = req.body.Password;
      user.Network = req.body.Network;
      
      if (req.body.Network != 'none') {
        Network.update({Sim: req.body.Sim, Name: req.body.Network}, {$push: {"Clients": {Token: req.body.Token}}}, function(err, network) {
	      if (err) res.send("oh look an error: " + err);
        });
      }
    
	  user.save(function(err) {
	    if (err) res.send("oh look an error: " + err);
        res.cookie('Sim', user.Sim, {signed: true});
	    res.json(user);
	  });
	}
	else
	  res.sendStatus(404);
  });
});

/* POST admin registration page. */
router.post('/admin/new', function(req, res, next) {
  var user = new User();
  user.Name = req.body.Name;
  user.Username = req.body.Username;
  user.Password = req.body.Password;
  user.Email = req.body.Email;
  user.Token = req.body.Token;
  user.Network = 'none';
  user.Type = "admin";
  user.Sim = req.body.Token;

  user.save(function(err) {
	if (err) res.send("oh look an error: " + err);
    res.cookie('Sim', user.Sim, {signed: true});
	res.json(user);
  });
});

// POST to get clients for selected sim
router.post('/client/networks', function(req, res, next) {
  Network.find({Sim: req.body.Sim}, function(err, networks) {
    if (err) res.send("oh look an error: " + err);
    res.json(networks);
  });
});

module.exports = router;
