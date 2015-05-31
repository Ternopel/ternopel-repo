var logger	= require('../../utils/logger');

module.exports = {
	get_authentication: function(req, res, next) {
		logger.info('Rendering authentication');
		res.render('authentication.html')
	},
	post_registration: function(req, res, next) {
		logger.info('Setting form properties');
		var formdata=req.body.user;
		logger.info('User trying to register:'+formdata.email_address);
		
		req.models.users.find({email_address: formdata.email_address}, function(err,user) {
			if(err) return next(err);
			if(user.length==1) {
				logger.info('User '+formdata.name+' already exists');
				return res.render('authentication.html',{errormessage: 'Usuario ya existe'});
			}
			else {
				logger.info('User '+formdata.email_address+' is new');
				req.models.users.create({email_address: formdata.email_address,password: formdata.password, role_id:2},function(err,user) {
					if(err) return next(err);
					logger.info('Redirecting to home');
					return res.redirect(301,'/');
				});
			}
		});
	}
};
