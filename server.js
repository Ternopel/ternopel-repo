'use strict';

var logger		= require("./utils/logger"),
	config		= require("./utils/config")(),
	cronconfig	= require("./utils/cronconfig"),
	app			= require("./app.js"),
	fs			= require('fs'),
	http		= require('http'),
	https		= require('https');
	
var options = {
	key: fs.readFileSync('support/key/server.key'),
	cert: fs.readFileSync('support/key/server.crt'),
	ca: fs.readFileSync('support/key/ca.crt'),
	requestCert: true,
	rejectUnauthorized: false
};

logger.info("Creating express app");
app.init(logger,config, function(app,db,models) {
	
	logger.info("Creating server https");
	var serverhttps = https.createServer(options);
	serverhttps.on('request',app);

	logger.info("Creating server http");
	var serverhttp = http.createServer();
	serverhttp.on('request',app);
	
	logger.info("Starting server https");
	serverhttps.listen(config.app_https_port,function() {
		logger.info('Listening https on port:'+serverhttps.address().port);
	});
	
	logger.info("Starting server http");
	serverhttp.listen(config.app_http_port,function() {
		logger.info('Listening http on port:'+serverhttp.address().port);
	});
	
	logger.info("Configuring cron");
	cronconfig.init(logger, config, models); 
});

require('jsreport').bootstrapper({ httpPort: 4000 }).start();
