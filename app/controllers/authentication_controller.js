var util	= require('util'),
	ld		= require('lodash');

module.exports = {
	get_authentication: function(req, res, next) {
		res.render('authentication.html',{errormessage: req.session.errormessage})
	},
	post_authentication: function(req, res, next) {

		req.logger.info("before body");
		req.logger.info(req.body);
		req.logger.info("after body");
		var email_address	= req.body.email_address;
		var password		= req.body.password;
		req.logger.info('User trying to register:'+req.body.email_address);
		
		req.logger.info("Defining validators");
		req.assert('email_address', 'El email ingresado es incorrecto').isEmail();
		req.assert('password', 'La clave es requerida').notEmpty();

		req.logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			logger.info("Errores de validacion encontrados:"+ld.pluck(valerrors,'msg'));
			return res.status(200).send(valerrors);
		}
		
		/*
		var valerrors = req.validationErrors();
		if(valerrors) {
			req.session.errormessage	= ld.pluck(valerrors,'msg');
			req.logger.info("ERRORMESSAGE:"+req.session.errormessage)
			return res.redirect('back');
//			return res.render('authentication.html',{errormessage:ld.pluck(valerrors,'msg')});
//			res.status(200).send(valerrors);
		}
		*/
		
		
		req.models.users.find({email_address: email_address}, function(err,user) {
			if(err) return next(err);
			if(user.length==1) {
				req.logger.info('User '+email_address+' already exists');
				req.session.errormessage	= 'Usuario ya existente';
				req.logger.info('Executing back');
				return res.redirect('back');
			}
			else {
				req.logger.info('User '+email_address+' is new');
				req.models.users.create({email_address: email_address,password: password, role_id:2},function(err,user) {
					if(err) return next(err);
					
					req.logger.info('User '+email_address+' has been created. Redirecting to home');
					return "success";
				});
			}
		});
	}
};
