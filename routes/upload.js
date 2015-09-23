var express = require('express');
var router = express.Router();
var fs = require('fs');

// GET apps page
router.get('/', function(req, res, next) {
  var nav = [ 
    {item : '<a href="/admin" id="home">HOME</a>'},
    {item : '<a href="/server" id="server">SERVER</a>'},
    {item : '<a href="/client" id="client">CLIENT</a>'},
    {item : '<a href="/upload" id="current">APPS</a>'}
  ];
  if (req.query.status === 'success')
    var status = 'Successful Upload';
    function getFiles(dir) {
      apps = [];
      var file = fs.readdirSync(dir);
      for (var i in file) {
        var name = dir + '/' + file[i];
        if (fs.statSync(name).isDirectory()) {
          apps.push({name: file[i]});
        }
      }
      res.render('upload', {apps: apps, nav: nav, status: status, title: 'Upload Page', partials: {layout: 'layout'} });
    }
    getFiles('./apps');
});

// POST to get files in selected directory
router.post('/files', function(req, res) {
    function getFiles(dir, files) {
      files = files || [];
      var file = fs.readdirSync('./apps/'+dir);
      for (var i in file) {
        var name = dir + '/' + file[i];
        if (fs.statSync('./apps/'+name).isDirectory()) {
          getFiles(name, files);
        }
        else {
          files.push({name: name});
        }
      }
      return files
    }
    res.json(getFiles(req.body.dir));
});

module.exports = router;
