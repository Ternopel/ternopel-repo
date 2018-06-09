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
	
	var credentials = {
		ca: fs.readFileSync(__dirname+"/support/godaddy/gd_bundle-g2-g1.crt", 'utf8'), //la certification authority o CA
		key: fs.readFileSync(__dirname+"/support/godaddy/my-private-key.pem", 'utf8'), //la clave SSL, que es el primer archivo que generamos ;)
		cert: fs.readFileSync(__dirname+"/support/godaddy/19beba59ea6fde44.crt", 'utf8') //el certificado
	};	
	
	app.disable('etag');
	
	logger.info("Creating http server");
	var http_server = http.createServer();
	http_server.on('request',app);

	logger.info("Creating https server");
	var https_server = https.createServer(credentials);
	https_server.on('request',app);
	
	logger.info("Starting http server");
	http_server.listen(config.app_http_port,function() {
		logger.info('Listening http on port:'+http_server.address().port);
	});
	
	logger.info("Starting https server");
	https_server.listen(config.app_https_port,function() {
		logger.info('Listening https on port:'+https_server.address().port);
	});
	
	logger.info("Configuring cron");
	cronconfig.init(logger, config, models, db); 
});

require('jsreport').bootstrapper({ httpPort: 4000 }).start();
