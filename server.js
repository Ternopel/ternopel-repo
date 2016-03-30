'use strict';

var logger		= require("./utils/logger"),
	config		= require("./utils/config")(),
	cronconfig	= require("./utils/cronconfig"),
	app			= require("./app.js"),
	fs			= require('fs'),
	http		= require('http');
//	https		= require('https');
	
//var options = {
//	key: fs.readFileSync('support/key/server.key'),
//	cert: fs.readFileSync('support/key/server.crt'),
//	ca: fs.readFileSync('support/key/ca.crt'),
//	requestCert: true,
//	rejectUnauthorized: false
//};

logger.info("Creating express app");
app.init(logger,config, function(app,db,models) {
	
	
	logger.info("Creating server");
//	var server = https.createServer(options);
	var server = http.createServer();
	server.on('request',app);

	logger.info("Starting server");
	server.listen(config.app_port,function() {
		logger.info('Listening on port:'+server.address().port);
	});
	
	logger.info("Configuring cron");
	cronconfig.init(logger, config, models, db); 
});

require('jsreport').bootstrapper({ httpPort: 4000 }).start();
