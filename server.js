'use strict';

var logger		= require("./utils/logger")(module),
	config		= require("./utils/config")(),
	cronconfig	= require("./utils/cronconfig"),
	app			= require("./app.js"),
	fs			= require('fs'),
	http		= require('http'),
	https		= require('https');
	

logger.info("Creating express app");
app.init(config, function(app,db,models) {
	
	app.disable('etag');
	
	logger.info("Creating http server");
	var http_server = http.createServer();
	http_server.on('request',app);

	logger.info("Starting http server");
	http_server.listen(config.app_http_port,function() {
		logger.info('Listening http on port:'+http_server.address().port);
	});
	
	logger.info("Configuring cron");
	cronconfig.init(logger, config, models, db); 
});

require('jsreport').bootstrapper({ httpPort: 4000 }).start();
