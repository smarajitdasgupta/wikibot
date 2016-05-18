var express = require('express');
var app = express();
var url = require('url');
var request = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 9001));

app.get('/', function(req, res){
  res.send('This works fine too!!');
});

app.post('/post', function(req, res){
  var parsed_url = url.format({
    pathname: 'https://en.wikipedia.org/w/api.php',
    query: {
      action: 'query',
      prop: 'extracts',
      exintro: '',
      explaintext: '',
      prop: 'extracts',
      format: 'json', //json format
      titles: req.body.text // search query
    }
  });

  request(parsed_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var obj = data.query.pages;

      var first_page = obj[Object.keys(obj)[0]];
      var first_snippet = first_page.extract.substring(0,350)+'...';
      var result_url = 'http://en.wikipedia.org/wiki/' + first_page.title;

      var return_result =  result_url + " " + first_snippet;

      var body = {
        response_type: "in_channel",
        text: "Wikipedia says...",
        attachments: [
        {
            title: first_page.title,
            title_link: result_url,
            text: first_snippet
        }
    ]
      };

      res.send(body);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
