var util	= require('util'),
	ld		= require('lodash');

module.exports = {
	get_registration: function(req, res, next) {
		res.render('registration.html',{ csrfToken: req.csrfToken() });
	},
	post_registration: function(req, res, next) {

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
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.info('Searching for existing user');
				req.models.users.find({email_address: email_address}, function(err,user) {
					if(err) {
						return callback(err);
					}
					if(user.length===1) {
						req.logger.info('User '+email_address+' already exists');
						var jsonerror = [{'param':'general','msg':'Usuario ya existente'}];
						return res.status(200).send(jsonerror);
					}
					else {
						return callback();
					}
				});
			}, 
			function(callback) {
				req.logger.info('Creating user '+email_address);
				req.models.users.create({email_address: email_address,password: password, role_id:2},function(err,user) {
					return callback(err,user);
				});
			},
			function(user,callback) {
				req.logger.info('Searching for current session');
				req.models.userssessions.find({token: req.cookies.ter_token},function(err,usersession) {
					return callback(err,usersession,user);
				});
			},
			function(usersession,user,callback) {
				req.logger.info('Assigning user to session');
				usersession[0].save({user_id: user.id},function(err) {
					req.usersession = usersession[0];
					return callback(err);
				});
			}
		], 
		function(err, result) {
			if(err) {
 				next(err);
			}
			return res.status(200).send('success');
		});
	}
};
