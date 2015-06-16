(function (expressconfig) {

	expressconfig.init = function (app, express, logger, config) {
		
		logger.debug("Setting 'winston' logger");
		app.use(logger.expressLogger);
		app.use(function(req, res, next) {
			req.logger	= logger;
			req.config	= config;
			next();
		});
		
		logger.debug("Setting constants");
		app.use(function(req, res, next) {
			req.constants = require('../utils/constants');
			next();
		});
		
		logger.debug("Setting public folder");
		var path = require('path');
		var publicFolder = path.dirname(module.parent.filename)	+ "/public";
		
		logger.debug("Setting 'dot' as view engine");
		var expressdot = require('../utils/express-dot');
		app.set('view engine', 'dot'); 
		app.engine('html', expressdot.__express); 

		logger.debug("Setting 'views' folder");
		app.set('views', "./app/views");

		logger.debug("Setting 'favicon'");
		var favicon			= require('serve-favicon');
		app.use(favicon(publicFolder+'/images/tp.ico'));
		
		logger.debug("Enabling GZip compression.");
		var compression = require('compression');
		app.use(compression({
			threshold: 512
		}));
		
		logger.debug("Setting 'Public' folder with maxAge: 1 Day.");
		var oneYear = 31557600000;
		app.use(express.static(publicFolder, { maxAge: oneYear }));

	
		logger.debug("Setting parse urlencoded request bodies into req.body.");
		var bodyParser = require('body-parser');
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());

		logger.debug("Setting express validator");
		var expressValidator	= require('express-validator');
		app.use(expressValidator());

		logger.debug("Setting cookie parser");
		var cookieParser = require('cookie-parser');
		app.use(cookieParser('nataliaypilarcita'));
		
		logger.debug("Generate unique identifiers");
		var csrf = require('csurf');
		app.use(csrf({ cookie: true }));
	};
	
	expressconfig.addErrorRoutes = function(app,logger) {

		// catch 404 and forward to error handler
		app.use(function(req, res, next) {
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		});

		// development error handler
		// will print stacktrace
		if (app.get('env') === 'development') {
			app.use(function(err, req, res, next) {
				var ld = require('lodash');
				var pageinfo = ld.merge(req.sessionstatus, {error:err});
				res.render('error.html',pageinfo);
			});
		}

		// production error handler
		// no stacktraces leaked to user
		app.use(function(err, req, res, next) {
			var ld = require('lodash');
			var pageinfo = ld.merge(req.sessionstatus, {error:err});
			res.render('error.html',pageinfo);
		});
		
		logger.debug("Setting 'winston' error logger");
		app.use(logger.expressErrorLogger);
	};

})(module.exports);
