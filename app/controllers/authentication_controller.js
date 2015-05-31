var logger	= require('../../utils/logger');

module.exports = {
	get_authentication: function(req, res, next) {
		res.render('authentication.html',{errormessage: req.session.errormessage})
	},
	post_registration: function(req, res, next) {
		logger.info('Setting form properties');
		var formdata=req.body.user;
		logger.info('User trying to register:'+formdata.email_address);
		
		req.models.users.find({email_address: formdata.email_address}, function(err,user) {
			if(err) return next(err);
			if(user.length==1) {
				logger.info('User '+formdata.email_address+' already exists');
				req.session.errormessage	= 'Usuario ya existente';
				logger.info('Executing back');
				return res.redirect('back');
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
