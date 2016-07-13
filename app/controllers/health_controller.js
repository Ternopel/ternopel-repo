'use strict';

module.exports = {
	get_health: function(req, res, next) {
		return res.status(200).send('OK');
	}
};


/*

'use strict';

var http = require('http');

var clientId = "FREE_TRIAL_ACCOUNT";
var clientSecret = "PUBLIC_SECRET";
var jsonPayload = JSON.stringify({
	number: "+54911588883335",
	message: "Hola, yo !"
});
var options = {
	hostname: "api.whatsmate.net",
	port: 80,
	path: "/v1/whatsapp/queue/message",
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"X-WM-CLIENT-ID": clientId,
		"X-WM-CLIENT-SECRET": clientSecret,
		"Content-Length": Buffer.byteLength(jsonPayload)
	}
};


module.exports = {
	get_health: function(req, res, next) {
	var request = new http.ClientRequest(options);
	request.end(jsonPayload);
	request.on('response', function (response) {
		console.log('Heard back from the WhatsMate WA Gateway:\n');
		console.log('Status code: ' + response.statusCode);
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log(chunk);
			return res.status(200).send('OK');
		});
	});		
	}
};
*/