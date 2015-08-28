'use strict';

var winston			= require('winston'),
	expressWinston	= require('express-winston'),
	dateformat		= require('dateformat'),
	config			= require('./config')();

winston.emitErrs = true;

var console = new winston.transports.Console({
	level: config.app_log_level,
	handleExceptions: false,
	json: false,
	colorize: true,
	timestamp: function() {
		 return dateformat(Date.now(),"yyyy/mm/dd HH:MM:ss:l");
	} /*,
	formatter: function(options) {
		return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
		(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
	}
	*/
});

var logger = new winston.Logger({
	transports : [ console ],
	meta: false, // optional: control whether you want to log the meta data about the request (default to true)
	msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
	colorStatus: true, 
	exitOnError : false
});

var expressLogger = new expressWinston.logger({
	transports : [ console ],
	meta: false, // optional: control whether you want to log the meta data about the request (default to true)
	msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
	colorStatus: true, 
	exitOnError : false
});

var expressErrorLogger = new expressWinston.errorLogger({
	transports : [ console ],
	meta: false, // optional: control whether you want to log the meta data about the request (default to true)
	msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
	colorStatus: true, 
	exitOnError : false
});

module.exports						= logger;
module.exports.expressLogger		= expressLogger;
module.exports.expressErrorLogger	= expressErrorLogger;
