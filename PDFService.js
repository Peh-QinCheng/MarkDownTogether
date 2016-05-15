var path =  require('path');
var marked = require('marked');
var handlebars = require('handlebars');
var fs = require('fs');
var pdf = require('html-pdf');

var source = fs.readFileSync('./template.html', 'utf8');
var template = handlebars.compile(source);
var options = {
  format: "A4",
  base: path.join('file:///',__dirname, 'base.css'),
  border: "30px"
};

module.exports = {
  run: function(input) {
    var html = marked(input, {sanitize: true, gfm: true, breaks: true});
    var data = {content: html};
    var result = template(data);
    pdf.create(result, options).toFile('./out/test2.pdf', function(err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
  }
};
