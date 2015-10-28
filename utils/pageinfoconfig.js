'use strict';

(function (pageinfoconfig) {
	
	var savesession	= function(req,next,usersession) {
		req.logger.debug('Changing last access');
		usersession.save({last_access: new Date()},function(err) {
			if(err) {
				next(err);
			}
			req.logger.info("Assigning current session to request");
			req.usersession = usersession;
			
			req.models.shoppingcart.count({user_session:usersession.id},function(err,count) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				var ld = require('lodash');
				req.pageinfo = ld.merge(req.pageinfo,{cart_count:count});
				return next();
			});
		});
	};
	
	var createsession = function(req,res,next) {
		req.logger.debug("Session has no token. Creating it");
		var token	= require('node-uuid').v1();
		req.logger.debug("Creating user session");
		req.models.userssessions.create({token: token,last_access: new Date()},function(err,usersession) {
			if(err) {
				return next(err);
			}
			req.logger.info('User is NOT logged IN !!');
			req.usersession		= usersession;
			req.pageinfo	= {is_logged_in:false, cart_count:0};
			req.logger.info('Created session:'+JSON.stringify(req.usersession));
			res.cookie("ter_token", token, { httpOnly: true, path: '/', maxAge: 365 * 24 * 60 * 60 * 1000 });
			next();
		});
	};
	
	var updatesession = function(req,res,next,usersession) {
		req.logger.debug("Session:"+JSON.stringify(usersession));
		req.logger.info('User is logged in:'+usersession.isLogged());
		if(usersession.isLogged()===true) {
			usersession.getUser(function (err, user) {
				if(err) {
					next(err);
				}
				req.logger.info('User logged in:'+user.fullName());
				req.pageinfo = {is_logged_in:true, full_name: user.fullName(), is_admin: user.isAdmin()};
				savesession(req,next,usersession);
			});
		}
		else {
			req.pageinfo	= {is_logged_in:false};
			savesession(req,next,usersession);
		}
	};

	pageinfoconfig.session = function (app) {
		app.use(function(req, res, next) {
			if(req.path==='/health') {
				return next();
			}
			req.logger.info("==================================");
			req.logger.info("New "+req.method+" to:"+req.path);
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
	
	pageinfoconfig.params = function (app) {
		app.use(function(req, res, next) {
			if(req.path==='/health') {
				return next();
			}
			var ld = require('lodash');
			req.pageinfo = ld.merge(req.pageinfo,{app_resources: req.config.app_resources});
			next();
		});
	};
	
})(module.exports);
