var express = require('express');
var router = express.Router();
var Network = require('../models/networksModel');
var User = require('../models/usersModel');
var Connect = require('../models/connectionsModel');

/* GET client registration page. */
router.get('/', function(req, res, next) {
  var nav = [ 
    {item : '<a href="/admin" id="current">HOME</a>'},
    {item : '<a href="/server" id="server">SERVER</a>'},
    {item : '<a href="/client" id="client">CLIENT</a>'},
    {item : '<a href="/upload" id="apps">APPS</a>'}
  ]
  var sim = req.signedCookies.Sim;
  Network.find({Sim: sim}, function(err, networks) {
    User.find({Type: "client", Sim: sim}, function(err2, clients) {
      res.render('admin', { network: networks, clients: clients, nav: nav, title: 'Admin Simulation Framework', partials: {layout: 'layout'} });
    });
  });
});

// POST new network to database and return ok or error
router.post('/add/network', function(req, res, next) {
  var network = new Network();
  network.Name = req.body.Name;
  network.Type = req.body.Type;
  network.Sim = req.signedCookies.Sim;
  
  network.save(function(err) {
    if (err) res.send("Oh look an error: " + err);
    res.sendStatus(200);
  });
});

// POST new client to database and return ok or error
router.post('/add/clients', function(req, res, next) {
  var user = new User();
  user.Name = null;
  user.Username = null;
  user.Password = null;
  user.Email = null;
  user.Token = req.body.Token;
  user.Network = null;
  user.Type = "client";
  user.Sim = req.signedCookies.Sim;

  user.save(function(err) {
    if (err) res.send("Oh look an error: " + err);
    res.sendStatus(200);
  });
});


// POST update of email to client to database and return ok or error
router.post('/add/client/email', function(req, res, next) {
  User.findOne({Sim: req.body.Sim, Token: req.body.Token}, function(err, user) {
	if (err) res.send("oh look an error: " + err);
	if (user != null) {
	  user.Email = req.body.Email;
	  user.save(function(err) {
	    if (err) res.send("Oh look an error: " + err);
	    res.sendStatus(200);
	  });
	}
	else
	  res.sendStatus(404);
  });
});

// POST deletion of network to database and return ok or error
router.post('/delete/network', function(req, res, next) {
  User.update({Sim: req.signedCookies.Sim, Network: req.body.Name}, {Network: 'none'}, {multi: true}, function(err, user) {
    if (err) res.send("Oh look an error: " + err);
  });
  
  Connect.find({Sim: req.signedCookies.Sim}, function(err, conn) {
    if (err) res.send("oh look an error: " + err);
    if (conn.length > 0) {
      for (var i = 0; i < conn.length; i++) {
        if ((conn[i].Network1 === (req.body.Name+'dot')) || (conn[i].Network2 === (req.body.Name+'dot'))) {
          Connect.remove({_id: conn[i]._id}, function(err, usr) {
            if (err) res.send("Oh look an error: " + err);
          });
        }
      }
    }
  });

  Network.remove({Sim: req.signedCookies.Sim, Name: req.body.Name, Type: req.body.Type}, function(err, network) {
    if (err) res.send("Oh look an error: " + err);
    res.sendStatus(200);
  });
});

// POST deletion of client to database and return ok or error
router.post('/delete/client', function(req, res, next) {
  User.findOne({Sim: req.signedCookies.Sim, Token: req.body.Token}, function(err, user) {
    if (user.Network != 'none') {
      Network.update({Sim: user.Sim, Name: user.Network}, {$pull: {"Clients": {Token: user.Token}}}, function(err, network) {
	    if (err) res.send("oh look an error: " + err);
      });
    }
    User.remove({_id: user._id}, function(err, usr) {
      if (err) res.send("Oh look an error: " + err);
      res.sendStatus(200);
    });
  });
});

module.exports = router;
