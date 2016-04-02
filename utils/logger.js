'use strict';

var winston			= require('winston'),
	expressWinston	= require('express-winston'),
	dateformat		= require('dateformat'),
	config			= require('./config')();

winston.emitErrs = true;

module.exports = function(callingModule) {
	
	var getLabel = function() {
		var parts = callingModule.filename.split(config.app_path_separator);
		return parts[parts.length - 2] + '/' + parts.pop();
	};
	
	var console2 = new winston.transports.Console({
		level: config.app_log_level,
		handleExceptions: false,
		json: false,
		colorize: true,
		timestamp: function() {
			 return dateformat(Date.now(),"yyyy/mm/dd HH:MM:ss:l") + " - " + getLabel();
		}
	});
	
	var logger = new winston.Logger({
		transports : [ console2 ],
		meta: false, 
		msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
		colorStatus: true, 
		exitOnError : false
	});
	
	logger.expressLogger		= new expressWinston.logger({
		transports : [ console2 ],
		meta: false, 
		msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
		colorStatus: true, 
		exitOnError : false
	});
	
	logger.expressErrorLogger	= new expressWinston.errorLogger({
		transports : [ console2 ],
		meta: false, 
		msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
		colorStatus: true, 
		exitOnError : false
	});

	
	return logger;
};


