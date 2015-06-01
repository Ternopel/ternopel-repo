(function (expressConfig) {

	var path				= require('path');
	var expressdot			= require('express-dot');

	expressConfig.init = function (app, express, logger) {
		
		logger.info("Setting 'winston' logger");
		app.use(logger.expressLogger);
		app.use(function(req, res, next) {
			req.logger = logger;
			next();
		});
		
		logger.info("Setting 'dot' as view engine");
		app.set('view engine', 'dot'); 
		app.engine('html', expressdot.__express); 

		logger.info("Setting 'views' folder");
		app.set('views', "./app/views");
		

		// uncomment after placing your favicon in /public
		// var favicon			= require('serve-favicon');
		//app.use(favicon(__dirname + '/public/favicon.ico'));
		
		logger.info("Enabling GZip compression.");
		var compression = require('compression');
		app.use(compression({
			threshold: 512
		}));
		
		logger.info("Session management");
		var session = require('express-session');
		app.use(session({
//				genid: function(req) {
//					return genuuid() // use UUIDs for session IDs
//				},
				secret: 'keyboard cat',
				resave: false,
				saveUninitialized: false,
				secure:	true
			}));
		
	
		logger.info("Setting 'Public' folder with maxAge: 1 Day.");
		var publicFolder = path.dirname(module.parent.filename)	+ "/public";
		var oneYear = 31557600000;
		app.use(express.static(publicFolder, { maxAge: oneYear }));

	
		logger.info("Setting parse urlencoded request bodies into req.body.");
		var bodyParser = require('body-parser');
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());

		logger.info("Setting express validator");
		var expressValidator	= require('express-validator');
		app.use(expressValidator());

		logger.info("Setting cookie parser");
		var cookieParser = require('cookie-parser');
		app.use(cookieParser());
	};
	
	expressConfig.addErrorRoutes = function(app,logger) {

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
				res.render('error.html',{error:err});
			});
		}

		// production error handler
		// no stacktraces leaked to user
		app.use(function(err, req, res, next) {
			res.render('error.html',{error:err});
		});
		
		logger.info("Setting 'winston' error logger");
		app.use(logger.expressErrorLogger);
	};

})(module.exports);
