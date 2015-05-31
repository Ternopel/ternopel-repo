var logger	= require('../../utils/logger');

module.exports = {
	get_authentication: function(req, res, next) {
		res.render('authentication.html')
	},
	post_registration: function(req, res, next) {
		logger.info('Setting form properties');
		var formdata=req.body.user;
		logger.info('User trying to register:'+formdata.name);
		
		req.models.users.find({email_address: formdata.name}, function(err,user) {
			if(err) return next(err);
			if(user.length==1) {
				logger.info("User "+formdata.name+" already exists");
				return res.render('authentication.html',{errormessage: 'Usuario ya existe'});
			}
			else {
				logger.info("User "+formdata.name+" is new");
				return res.redirect(301,'/');
			}
		});
	}
	
};
