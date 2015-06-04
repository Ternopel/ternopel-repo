var util	= require('util'),
	ld		= require('lodash');

module.exports = {
	get_authentication: function(req, res, next) {
		res.render('authentication.html',{ csrfToken: req.csrfToken() });
	},
	post_authentication: function(req, res, next) {

		var email_address	= req.body.email_address;
		var password		= req.body.password;
		req.logger.info('User trying to register:'+req.body.email_address);
		
		req.logger.info("Defining validators");
		req.assert('email_address', 'El email ingresado es incorrecto').isEmail();
		req.assert('password', 'La clave es requerida').notEmpty();

		req.logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			req.logger.info("Errores de validacion encontrados:"+JSON.stringify(valerrors));
			return res.status(200).send(valerrors);
		}
		req.logger.info("Validation approved");
		
		req.models.users.find({email_address: email_address}, function(err,user) {
			if(err) {
				return next(err);
			}
			if(user.length===1) {
				req.logger.info('User '+email_address+' already exists');
				var jsonerror = [{'param':'general','msg':'Usuario ya existente'}];
				return res.status(200).send(jsonerror);
			}
			else {
				req.logger.info('User '+email_address+' is new');
				req.models.users.create({email_address: email_address,password: password, role_id:2},function(err,user) {
					if(err) {
						return next(err);
					}
					
					req.logger.info('User '+email_address+' has been created. Returning control to client');
					return res.status(200).send('success');
				});
			}
		});
	}
};
