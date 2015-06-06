(function (sessionconfig) {
	
	createsession = function(req,res,next) {
		req.logger.debug("Session has no token. Creating it");
		var token	= require('node-uuid').v1();
		req.logger.debug("Creating user session");
		req.models.userssessions.create({token: token,last_access: new Date()},function(err,usersession) {
			if(err) {
				return next(err);
			}
			req.logger.debug('User is NOT logged IN !!');
			req.usersession = usersession;
			req.logger.info('Created session:'+JSON.stringify(req.usersession));
			res.cookie("ter_token", token, { secure:true, httpOnly: true, path: '/', maxAge: 365 * 24 * 60 * 60 * 1000 });
			next();
		});
	};
	
	updatesession = function(req,res,next,usersession) {
		req.logger.debug("Session:"+JSON.stringify(usersession));
		req.logger.debug('User is logged in:'+usersession.isLogged());
		req.logger.debug('Changing last access');
		usersession.save({last_access: new Date()},function(err) {
			if(err) {
				next(err);
			}
			req.logger.info("Assigning current session to request");
			req.usersession = usersession;
			return next();
		});
	}
	

	sessionconfig.init = function (app) {
		app.use(function(req, res, next) {
			req.logger.info("==================================");
			req.logger.info("New request to:"+req.path);
			req.logger.info("==================================");
			
			var ter_token = req.cookies.ter_token;
			if(!ter_token) {
				req.logger.info("Creating session");
				createsession(req,res,next);
			}
			else {
				req.logger.info('Searching for session');
				req.models.userssessions.find({token: ter_token},function(err,usersession) {
					if(err) {
						next(err);
					}
					if(usersession.length===0) {
						req.logger.info("Session missing. Recreating it");
						createsession(req,res,next);
					}
					else {
						req.logger.info("Updating session timestamp");
						updatesession(req,res,next,usersession[0]);
					}
				});
			}
		});
	};
	
})(module.exports);
