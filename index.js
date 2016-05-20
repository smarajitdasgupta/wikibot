var express = require('express');
var app = express();
var url = require('url');
var request = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 9001));

app.get('/', function(req, res){
  res.send('News Jira works fine too!!');
});

app.post('/detail', function(req, res){



var slackText = req.body.text;

var username = 'dasguptas',
    password = 'sdgpakai2K0',
    requestUrlwithAuth = 'http://' + username + ':' + password + '@dashboard.news.com.au/rest/api/latest/issue/' + slackText;

  var parsed_url = url.format({
    pathname: requestUrlwithAuth
  });

console.log(parsed_url);

request({url: parsed_url}, function (error, response, body) {
if (!error && response.statusCode == 200) {
  var data = JSON.parse(body);
  var obj = data.fields,
      jira = {
        title: obj.summary,
        id: data.key,
        url: "http://dashboard.news.com.au/browse/"+data.key,
        description: obj.description,
        assignee: obj.assignee ? {
          name: obj.assignee.displayName,
          email: obj.assignee.emailAddress,
          imgObj: obj.assignee.avatarUrls
        } : {},
        components: obj.components ? {
          name: obj.components[0] ? obj.components[0].name : "N/A"
        } : {},
        status: obj.status ? {
          name: obj.status.name,
          progress: obj.status.statusCategory.name,
          color: obj.status.statusCategory.color
        } : {},
        reporter : obj.reporter.displayName,
        priority : obj.priority ? {
          name: obj.priority.name
        } : {},
        issuetype: obj.issuetype ? {
          name: obj.issuetype.name
        } : {}
  };

var priority = jira.priority.name, 
    priorityColor;

if (priority === "Major"){
  priorityColor = "danger";
}
else if (priority === "Blocker"){
  priorityColor = "#000000";
}
else if (priority === "Critical"){
  priorityColor = "#FF0000";
}
else if (priority === "Minor"){
  priorityColor = "good";
}
else if (priority === "Trivial"){
  priorityColor = "#439FE0";
}
else {
  priorityColor = "#cccccc";
}




 /*var body = {
        response_type: "in_channel",
        text: jira.title
  };
*/
       var body = {
        response_type: "in_channel", // or ephemeral for messages lasting short while
        text: jira.id + " (priority: "+ priority.toLowerCase() + ") " + jira.issuetype.name.toUpperCase() + " details...",
        attachments: [
          {
              fallback: "You should not be seeing this. Something went wrong...",
              title: jira.title,
              title_link: jira.url,
              text: jira.description,
            //  image_url: jira.assignee.imgObj[Object.keys(jira.assignee.imgObj)[0]],
              fields: [
                {
                    title: "Assignee",
                    value: jira.assignee.name,
                    short: true
                },
                {
                    title: "Status",
                    value: jira.status.name.toUpperCase(),
                    short: true
                },
                {
                    title: "Reporter",
                    value: jira.reporter,
                    short: true
                },
                {
                    title: "Component",
                    value: jira.components.name,
                    short: true
                }
              ],
              color: priorityColor
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
