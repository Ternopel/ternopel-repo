var logger			= require("./utils/logger"),
	express			= require('express'),
	dots			= require("dot").process({path: "./views"}),
	expressConf		= require("./utils/express-config");

var app = express();

logger.info("configuring express....");
expressConf.init(app, express);
logger.info("Express configured");

logger.info("configuring /");
var routes = require('./routes/index')(dots);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
