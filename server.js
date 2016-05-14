var express = require('express');
var path =  require('path');
var bodyParser = require('body-parser');
var PDFService = require('./PDFService');
var app = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'dist')));

app.post('/send', function (req, res) {
  //handle req.body.styles
  PDFService.run(req.body.text);
  return res.send({status: 'OK'});
});

app.listen(3000);

console.log("Running at Port 3000");
