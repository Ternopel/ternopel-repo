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
	exitOnError : false
});

var expressLogger = new expressWinston.logger({
	transports : [ console ],
	exitOnError : false
});

var expressErrorLogger = new expressWinston.errorLogger({
	transports : [ console ],
	exitOnError : false
});

module.exports						= logger;
module.exports.expressLogger		= expressLogger;
module.exports.expressErrorLogger	= expressErrorLogger;
