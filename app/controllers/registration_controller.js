var cipher = require('../../utils/cipher');

module.exports = {
	get_registration: function(req, res, next) {
		res.render('registration.html',{ csrfToken: req.csrfToken(), is_registration:true });
	},
	get_login: function(req, res, next) {
		res.render('registration.html',{ csrfToken: req.csrfToken(), is_registration:false });
	},
	post_registration: function(req, res, next) {

		var email_address	= req.body.email_address;
		var password		= req.body.password;
		var last_name		= req.body.last_name;
		var first_name		= req.body.first_name;
		var is_registration	= req.body.is_registration;
		req.logger.debug('User trying to register:'+req.body.email_address);
		
		req.logger.debug("Defining validators");
		req.assert('email_address', 'El email ingresado es incorrecto').isEmail();
		req.assert('password', 'La clave es requerida').notEmpty();
		if(is_registration==='true') {
			req.assert('last_name', 'El apellido es requerido').notEmpty();
			req.assert('first_name', 'El nombre es requerido').notEmpty();
		}

		req.logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			req.logger.debug("Errores de validacion encontrados:"+JSON.stringify(valerrors));
			return res.status(200).send(valerrors);
		}
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.debug('Searching for existing user');
				req.models.users.find({email_address: email_address}, function(err,user) {
					if(err) {
						return callback(err);
					}
					if(is_registration==='true') {
						if(user.length===1) {
							req.logger.info('User '+email_address+' already exists');
							var jsonerror = [{'param':'general','msg':'Usuario ya existente'}];
							return res.status(200).send(jsonerror);
						}
						else {
							return callback(null,null);
						}
					}
					
					if(is_registration==='false') {
						if(user.length===0) {
							req.logger.info('User '+email_address+' does not exists');
							var jsonerror = [{'param':'general','msg':'Usuario no existente'}];
							return res.status(200).send(jsonerror);
						}
						else {
							return callback(null,user[0]);
						}
					}
				});
			}, 
			function(user,callback) {
				if(is_registration==='true') {
					req.logger.info('Creating user '+email_address);
					req.models.users.create({	email_address:	email_address,
												password:		cipher.encrypt(password), 
												role_id:		req.constants.CUSTOMER_ID,
												last_name:		last_name,
												first_name:		first_name},function(err,user) {
						return callback(err,user);
					});
				}

				if(is_registration==='false') {
					if(user.password != cipher.encrypt(password)) {
						req.logger.info('Password does not match');
						var jsonerror = [{'param':'general','msg':'Password invalida'}];
						return res.status(200).send(jsonerror);
					}
					else {
						return callback(null,user);
					}
				}
			},
			function(user,callback) {
				req.logger.info('Assigning user to session');
				req.usersession.setUser(user,function(err) {
					if(err) {
						next(err);
					}
					req.logger.info('Complete session:'+JSON.stringify(req.usersession));
					return callback(err,user);
				});
			}
		], 
		function(err, user) {
			if(err) {
 				next(err);
			}
			else {
				if(user.isAdmin()) {
					return res.status(200).send('success_admin');
				}
				if(!user.isAdmin()) {
					return res.status(200).send('success_client');
				}
			}
		});
	}
};
