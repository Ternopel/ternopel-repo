'use strict';

(function (expressconfig) {

	expressconfig.init = function (app, express, logger, config) {
		
		if(config.app_redirect_to_https==='true') {
			logger.debug("Forward to https if request comes from http");
			app.use(function(req,res,next) {
				if (!/https/.test(req.protocol)){
					var port="";
					if(config.app_https_port!==443) {
						port=":"+config.app_https_port;
					}
					res.redirect(301,"https://"+req.hostname+port+ req.url);
				} 
				else {
					return next();
				}
			});
		}
		
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
		app.set('views', path.dirname(module.parent.filename)+"/app/views");
		
		logger.debug("Setting 'favicon'");
		var favicon			= require('serve-favicon');
		app.use(favicon(publicFolder+'/icon/tp.ico'));
		
		logger.debug("Enabling GZip compression.");
		var compression = require('compression');
		app.use(compression({
			threshold: 512
		}));
		
		logger.debug("Setting 'Public' folder with maxAge: 1 Day.");
		var oneYear = 31557600000;
		app.use(express.static(publicFolder, { maxAge: oneYear }));

	
		var bodyMaxSize = 1024 * 1024 * 8 * 100;
		logger.debug("Setting parse urlencoded request bodies into req.body.");
		var bodyParser = require('body-parser');
		app.use(bodyParser.urlencoded({ extended: true, limit: bodyMaxSize }));
		app.use(bodyParser.json({limit: bodyMaxSize}));

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

		// development error handler
		// will print stacktrace
		if (app.get('env') === 'development') {
			app.use(function(err, req, res, next) {
				logger.error(err);
				var ld = require('lodash');
				var pageinfo = ld.merge(req.pageinfo, {error:err});
				res.render('error.html',pageinfo);
			});
		}

		// production error handler
		// no stacktraces leaked to user
		app.use(function(err, req, res, next) {
			logger.error(err);
			var ld = require('lodash');
			var pageinfo = ld.merge(req.pageinfo, {error:err});
			res.render('error.html',pageinfo);
		});
		
		logger.debug("Setting 'winston' error logger");
		app.use(logger.expressErrorLogger);
		
		process.on('uncaughtException', function (err) {
			logger.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
			logger.error(err.stack);
			process.exit(1);
		});
	};

})(module.exports);
