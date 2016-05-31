'use strict';

var logger = require("./logger")(module);

(function (pageinfoconfig) {
	
	var savesession	= function(req,next,usersession) {
		logger.debug('Changing last access');
		usersession.save({last_access: new Date()},function(err) {
			if(err) {
				next(err);
			}
			logger.info("Assigning current session to request");
			req.usersession = usersession;
			
			req.models.shoppingcart.count({user_session_id:usersession.id},function(err,count) {
				if(err) {
					return next(err);
				}
				var ld = require('lodash');
				req.pageinfo = ld.merge(req.pageinfo,{cart_count:count});
				return next();
			});
		});
	};
	
	var createsession = function(req,res,next) {
		logger.debug("Session has no token. Creating it");
		var token	= require('node-uuid').v1();
		logger.debug("Creating user session");
		req.models.userssessions.create({token: token,last_access: new Date()},function(err,usersession) {
			if(err) {
				return next(err);
			}
			logger.info('User is NOT logged IN !!');
			req.usersession		= usersession;
			req.pageinfo		= {is_logged_in:false, cart_count:0};
			logger.info('Created session:'+JSON.stringify(req.usersession));
			logger.warn('WHAT IS :'+req.protocol);
			res.cookie("ter_token", token, { httpOnly: true, secure:req.secure, path: '/', maxAge: 365 * 24 * 60 * 60 * 1000 });
			next();
		});
	};
	
	var updatesession = function(req,res,next,usersession) {
		logger.debug("Session:"+JSON.stringify(usersession));
		logger.info('User is logged in:'+usersession.isLogged());
		if(usersession.isLogged()===true) {
			usersession.getUser(function (err, user) {
				if(err) {
					next(err);
				}
				logger.info('User logged in:'+user.fullName());
				req.pageinfo = {is_logged_in:true, 
								user_id: user.id,
								full_name: user.fullName(), 
								is_admin: user.isAdmin(), 
								email_address: user.email_address, 
								first_name: user.first_name, 
								last_name: user.last_name};
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
			logger.info("==================================");
			if(req.path.indexOf("/images")===0) {
				logger.info(req.method+" to:"+req.path);
			}
			else {
				logger.warn(req.method+" to:"+req.path+" - "+req.headers['user-agent']);
			}
			logger.info("==================================");
			
			var ter_token = req.cookies.ter_token;
			if(!ter_token) {
				logger.info("Creating session");
				createsession(req,res,next);
			}
			else {
				logger.info('Searching for session');
				req.models.userssessions.find({token: ter_token},function(err,usersession) {
					if(err) {
						next(err);
					}
					if(usersession.length===0) {
						logger.info("Session missing. Recreating it");
						createsession(req,res,next);
					}
					else {
						logger.info("Updating session timestamp");
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
			req.pageinfo = ld.merge(req.pageinfo,{app_resources: req.config.app_resources, page_title: 'Papelera Ternopel',is_home:false, og_images: []});
			req.models.categories.find({},['name'],function(err,categories) {
				if(err) {
					return next(err);
				}
				req.pageinfo = ld.merge(req.pageinfo,{footer_categories: categories});
				next();
			});
		});
	};
	
})(module.exports);
