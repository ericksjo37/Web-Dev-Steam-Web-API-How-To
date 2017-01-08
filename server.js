var express = require('express');
var request = require('request');
var key = "09EE70BDB367F9D3773C78181439573F";

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.set('port', 51522);

app.use(function (req, res, next) {
	// Website sending requests
	res.setHeader('Access-Control-Allow-Origin', 'http://web.engr.oregonstate.edu');
	// Request method that you are allowing (we are using GET)
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	// Request header types that are allowed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	// The following is set to false since we won't be addressing cookies and sessions
	res.setHeader('Access-Control-Allow-Credentials', false);
	// Proceed to the next layer of middleware
	next();
});	

function getUserData(req) {
	var context = {};
	context.method = req.method;
	context.queryParams = [];
	
	for (var prop in req.query) {
	 context.queryParams.push({'name':prop,'value':req.query[prop]});
	}
	return context;
}


function buildURL(getUserInput) {
	var temp = "http://api.steampowered.com/" + getUserInput.queryParams[0].value + '?key=' + key + getUserInput.queryParams[1].value;
	return temp;
}
app.get('/',function(req,res){
  var getUserInput = getUserData(req);
  var url = buildURL(getUserInput);
  console.log(url);
  request(url, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			//console.log(body); 
			res.send(body); 
	}
	});
});

	


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

