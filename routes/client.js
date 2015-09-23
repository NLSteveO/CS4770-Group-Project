var express = require('express');
var router = express.Router();
var User = require('../models/usersModel');
var Network = require('../models/networksModel');

/* GET client page. */
router.get('/', function(req, res, next) {
  var nav = [ 
    {item : '<a href="/admin" id="home">HOME</a>'},
    {item : '<a href="/server" id="server">SERVER</a>'},
    {item : '<a href="/client" id="current">CLIENT</a>'},
    {item : '<a href="/upload" id="apps">APPS</a>'}
  ]
  res.render('client', { nav: nav, title: 'Client Page', partials: {layout: 'layout'} });
});

// POST update of network to client in database
router.post('/update/network', function(req, res, next) {
  User.findOne({Sim: req.body.Sim, Token: req.body.Token}, function(err, user) {
	if (err) res.send("oh look an error: " + err);
    if (user.Network != 'none') {
      Network.update({Sim: user.Sim, Name: user.Network}, {$pull: {"Clients": {Token: user.Token}}}, function(err, network) {
	    if (err) res.send("oh look an error: " + err);
      });
    }
    if (req.body.Network != 'none') {
      Network.update({Sim: req.body.Sim, Name: req.body.Network}, {$push: {"Clients": {Token: req.body.Token}}}, function(err, network) {
	    if (err) res.send("oh look an error: " + err);
      });
    }
    
    user.Network = req.body.Network;
    user.save(function(err) {
	  if (err) res.send("oh look an error: " + err);
	  res.sendStatus(200);
	});
  });
});

module.exports = router;
