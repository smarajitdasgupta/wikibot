var express = require('express');
var app = express();
var url = require('url');
var request = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 9001));

app.get('/', function(req, res){
  res.send('Wiki News works fine!!');
});

app.post('/post', function(req, res){
  var parsed_url = url.format({
    pathname: 'http://wiki.news.com.au/rest/prototype/1/search/name.json',
    query: {
      query: req.body.text // search query
    }
  });

  request(parsed_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      //var obj = data.group;

      //var first_item = obj[Object.keys(obj)[0]];
     // var first_snippet = first_page.extract.substring(0,250)+'...';
    //  var first_title = first_item.result[0].title;
     // var first_creator = (first_item.result[0].creator ? first_item.result[0].creator.displayName : "Anonymous")

var first_title = "Title here";
var first_creator = "Creator name";

    //  var result_url = 'http://en.wikipedia.org/wiki/' + first_page.title;

  
      var body = {
        response_type: "in_channel",
        text: "Found something on the wiki...",
        attachments: [
        {
            title: first_title,
           title_link: 'http://google.com',
            text: first_creator
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
