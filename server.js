var express = require('express');
var path =  require('path');
var marked = require('marked');
var bodyParser = require('body-parser');
var handlebars = require('handlebars');
var fs = require('fs');
var pdf = require('html-pdf');
var app = express();



app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'dist')));


var source = fs.readFileSync('./template.html', 'utf8')
var template = handlebars.compile(source)
var options = {
  format: "A4",
  base: "file:///Users/pehqincheng/Desktop/markdowntgt/app/base.css",
  border: "30px"
}

app.post('/send', function (req, res) {
  var html = marked(req.body.text, {sanitize: true, gfm: true, breaks: true});
  var data = {content: html};
  var result = template(data);
  pdf.create(result, options).toFile('./out/test2.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res);
  });
  return res.send({status: 'OK'});
});

app.listen(3000);

console.log("Running at Port 3000");
