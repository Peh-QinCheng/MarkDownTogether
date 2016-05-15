var express = require('express');
var path =  require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var PDFService = require('./PDFService');
var app = express();

var io = require('socket.io')();
io.on('connection', function(socket){
  console.log('new user')
  socket.on('text edited', function (data) {
    io.emit('text', { text: data.text });
  });

  socket.on('css edited', function (data) {
    io.emit('css', { text: data.text });
    console.log(data);
  });
});
io.listen(8080);

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'dist')));

app.post('/send', function (req, res) {
  //handle req.body.styles
  fs.appendFile('base.css', req.body.style, (err) => {
    if (err) throw err;
  });
  PDFService.run(req.body.text);
  return res.send({status: 'OK'});
});

app.listen(3000);

io.on('connection', function(){ console.log('new user')});

console.log("Running at Port 3000");
