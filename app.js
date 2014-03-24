
var fs = require('fs');
var express = require('express');
var app = express();
var Showdown = require('showdown');
var Grid = require('./web/js/grid-sd');
var converter = new Showdown.converter({ extensions: [Grid] });
var jade = require('jade');

function handleFile(req, res, file, options) {
  res.set('Content-Type', options.type);

  // validate path
  if (/\.\.|[/]/.exec(file) !== null) {
    res.status(400).send('Invalid path');
    return;
  }

  if (options.extension) {
    file = file + '.' + options.extension;
  }

  // load the file from path
  fs.readFile(options.path + file, 'utf8', function(err, data) {
    if (err) {
      res.status(404).send('No such file or directory');
      return;
    }

    if (options.filter) {
      options.filter(req, res, data);
    } else {
      res.send(data);
    }
  });
}

var fileTypes = [
  { urlpath: '/', path: './web/', extension: 'md', type: 'text/html', filter: function(req, res, data) {
    fs.readFile('./template/index.jade', 'utf8', function(err, templateData) {
      if (err) {
        res.status(404).send('Failed to load jade template');
        return;
      }
      var template = jade.compile(templateData);
      res.send(template({ contents: converter.makeHtml(data) }));
    });
  }},
  { urlpath: '/js/', path: './web/js/', type: 'application/javascript' },
  { urlpath: '/css/', path: './web/css/', type: 'text/css' },
];

fileTypes.forEach(function(options) {
  app.get(options.urlpath + ':file', function(req, res) {
    handleFile(req, res, req.params.file, options);
  });
});

app.get('/', function(req, res) {
  return handleFile(req, res, 'index', fileTypes[0]);
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

