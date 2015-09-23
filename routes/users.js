var express = require('express');
var router = express.Router();
var User = require('../models/usersModel');
var Network = require('../models/networksModel');
var Connect = require('../models/connectionsModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var nav = [ 
    {item : '<a href="/admin" id="home">HOME</a>'},
    {item : '<a href="/server" id="server">SERVER</a>'},
    {item : '<a href="/client" id="client">CLIENT</a>'},
    {item : '<a href="/upload" id="apps">APPS</a>'}
  ];
  // Retrieve all users, networks, and connections from database
  User.find(function(err, users) {
    if (err) res.send("oh look an error: " + err);
    Network.find(function(err, networks) {
      if (err) res.send("oh look an error: " + err);
      Connect.find(function(err, conn) {
        if (err) res.send("oh look an error: " + err);
        res.render('users', { users: users, networks: networks, conn: conn, nav: nav, title: 'Database View Page', partials: {layout: 'layout'} });
      });
    });
  });
});

module.exports = router;
