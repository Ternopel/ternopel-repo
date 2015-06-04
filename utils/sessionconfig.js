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
				req.logger.info("Updating token:"+ter_token);
				req.models.userssessions.find({token: ter_token},function(err,usersession) {
					if(err) {
						return next(err);
					}
					req.logger.info("User session id:"+usersession[0].id);
					usersession[0].save({last_access: new Date()},function(err) {
						if(err) {
							return next(err);
						}
						next();
					});
				});
			}
		});
	};
	
})(module.exports);
