(function (expressConfig) {

	var logger				= require("../utils/logger");
	var path				= require('path');

	expressConfig.init = function (app, express) {

		logger.info("Setting 'html' as view engine");
		app.set('view engine', 'html'); 

		logger.info("Setting 'views' folder");
		app.set('views', path.join(__dirname, 'views'));

		// uncomment after placing your favicon in /public
		// var favicon			= require('serve-favicon');
		//app.use(favicon(__dirname + '/public/favicon.ico'));
		
		logger.info("Enabling GZip compression.");
		var compression = require('compression');
		app.use(compression({
			threshold: 512
		}));
	
		logger.info("Setting 'Public' folder with maxAge: 1 Day.");
		var publicFolder = path.dirname(module.parent.filename)	+ "/public";
		var oneYear = 31557600000;
		app.use(express.static(publicFolder, { maxAge: oneYear }));

		logger.info("Setting express validator");
		var expressValidator	= require('express-validator');
		app.use(expressValidator());
	
		logger.info("Setting parse urlencoded request bodies into req.body.");
		var bodyParser = require('body-parser');
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());

		logger.info("Setting cookie parser");
		var cookieParser = require('cookie-parser')
		app.use(cookieParser());
	
		logger.info("Overriding 'Express' logger");
		var morgan = require('morgan');
		app.use(morgan('combined'));
	};

})(module.exports);
