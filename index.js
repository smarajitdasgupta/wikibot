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

app.post('/details', function(req, res){

 var username = 'reddyv1',
   password = 'Cognizant@6065',
   requestUrlwithAuth = 'http://' + username + ':' + password + '@wiki.news.com.au/rest/prototype/1/search/name.json';

   var parsed_url = url.format({
    pathname: requestUrlwithAuth,
    query: {
      query: req.body.text // search query
    }
  });

  request({url: parsed_url}, function (error, response, body) {
  // Do more stuff with 'body' here 
  /*smarajit try below for complete body*/
    //res.send(JSON.parse(body));
    res.send(JSON.parse(body).group[0].result[0].link[0].href);
  //res.send(body.result.link[0]);
});
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
