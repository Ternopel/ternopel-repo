var util = require('util');

module.exports = {
	get_authentication: function(req, res, next) {
		res.render('authentication.html',{errormessage: req.session.errormessage})
	},
	post_registration: function(req, res, next) {
		
		req.assert(['user', 'email_address'], 'El email ingresado es incorrecto').isEmail();
		
		var valerrors = req.validationErrors();
		if(valerrors) {
			for(mykey in valerrors) {
				req.logger.info("======================");
				req.logger.info(mykey);
				req.logger.info("======================");
			}
			req.session.errormessage	= valerrors.msg;
			return res.redirect('back');
		}
		
		
		req.logger.info('Setting form properties');
		var formdata=req.body.user;
		req.logger.info('User trying to register:'+formdata.email_address);
		
		req.models.users.find({email_address: formdata.email_address}, function(err,user) {
			if(err) return next(err);
			if(user.length==1) {
				req.logger.info('User '+formdata.email_address+' already exists');
				req.session.errormessage	= 'Usuario ya existente';
				req.logger.info('Executing back');
				return res.redirect('back');
			}
			else {
				req.logger.info('User '+formdata.email_address+' is new');
				req.models.users.create({email_address: formdata.email_address,password: formdata.password, role_id:2},function(err,user) {
					if(err) return next(err);
					req.logger.info('Redirecting to home');
					return res.redirect(301,'/');
				});
			}
		});
	}
};
