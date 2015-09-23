var express = require('express');
var router = express.Router();
var User = require('../models/usersModel');
var Network = require('../models/networksModel');
var Connect = require('../models/connectionsModel');

/* GET server page. */
router.get('/', function(req, res, next) {
  var nav = [ 
    {item : '<a href="/admin" id="home">HOME</a>'},
    {item : '<a href="/server" id="current">SERVER</a>'},
    {item : '<a href="/client" id="client">CLIENT</a>'},
    {item : '<a href="/upload" id="apps">APPS</a>'}
  ]
  var sim = req.signedCookies.Sim;
  Network.find({Sim: sim}, function(err, networks) {
    if (err) res.send("oh look an error: " + err);
    User.find({Sim: sim}, function(err2, clients) {
      if (err2) res.send("oh look an error: " + err2);
      Connect.find({Sim: sim}, function(err3, conns) {
        if (err3) res.send("oh look an error: " + err3);
        res.render('server', { conns: conns, network: networks, clients: clients, nav: nav, title: 'Network Topology', partials: {layout: 'layout'} });
      });
    });
  });
});

// POST to connect two networks
router.post('/connect/network', function(req, res, next) {
  var exists = false;
  Connect.find({Sim: req.body.Sim}, function(err, conn) {
    if (err) res.send("oh look an error: " + err);
    if (conn.length > 0) {
      for (var i = 0; i < conn.length; i++) {
        if (((conn[i].Network1 === req.body.Network1) && (conn[i].Network2 === req.body.Network2)) || ((conn[i].Network1 === req.body.Network2) && (conn[i].Network2 === req.body.Network1))) {
          exists = true;
          break;
        }
      }
    }
    if (!exists) {
      var connect = new Connect();
      connect.Network1 = req.body.Network1;
      connect.Network2 = req.body.Network2;
      connect.Sim = req.body.Sim;
      
      connect.save(function(err) {
        if (err) res.send("oh look an error: " + err);
      });
    }
    res.sendStatus(200);
  });
});

// POST to disconnect two networks
router.post('/remove/connect', function(req, res, next) {
  Connect.find({Sim: req.body.Sim}, function(err, conn) {
    if (err) res.send("oh look an error: " + err);
    if (conn.length > 0) {
      for (var i = 0; i < conn.length; i++) {
        if (((conn[i].Network1 === req.body.Network1) && (conn[i].Network2 === req.body.Network2)) || ((conn[i].Network1 === req.body.Network2) && (conn[i].Network2 === req.body.Network1))) {
          Connect.remove({_id: conn[i]._id}, function(err, usr) {
            if (err) res.send("Oh look an error: " + err);
            res.sendStatus(200);
          });
          break;
        }
      }
    }
  });
});

module.exports = router;
