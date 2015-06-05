(function (sessionconfigu) {

	sessionconfigu.init = function (app) {
		app.use(function(req, res, next) {
			
			var ter_token = req.cookies.ter_token;
			if(!ter_token) {
				req.logger.info("Session has no token. Creating it");
				var token	= require('node-uuid').v1();
				req.logger.info("Creating user session");
				req.models.userssessions.create({token: token,last_access: new Date()},function(err,usersession) {
					if(err) {
						return next(err);
					}
					res.cookie("ter_token", token, { secure:true, httpOnly: true, path: '/', maxAge: 365 * 24 * 60 * 60 * 1000 });
					next();
				});
			}
			else {
				var waterfall = require('async-waterfall');
				waterfall([ 
					function(callback) {
						req.logger.info('Searching for session');
						req.models.userssessions.find({token: ter_token},function(err,usersession) {
							return callback(err,usersession);
						});
					}, 
					function(usersession, callback) {
						req.logger.info('Changing last access');
						usersession[0].save({last_access: new Date()},function(err) {
							return callback(err);
						});
					}
				], 
				function(err, result) {
					next(err);
				});
			}
		});
	};
	
})(module.exports);
