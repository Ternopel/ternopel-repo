var winston			= require('winston'),
	expressWinston	= require('express-winston');

winston.emitErrs = true;

var console = new winston.transports.Console({
	level: 'info',
	handleExceptions: true,
	json: false,
	colorize: true
})

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
