'use strict';

var cipher	= require('../../utils/cipher'),
	utils	= require('./utils'),
	ld		= require('lodash');

module.exports = {
	get_registration: function(req, res, next) {
		var pageinfo = ld.merge(req.pageinfo, { csrfToken: req.csrfToken(), is_registration:true });
		res.render('registration.html',pageinfo);
	},
	get_login: function(req, res, next) {
		var pageinfo = ld.merge(req.pageinfo, { csrfToken: req.csrfToken(), is_registration:false });
		res.render('registration.html',pageinfo);
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
		req.assert('is_registration', 'Parametro de tipo de registracion es requerido').notEmpty();
		if(is_registration==='true') {
			req.assert('last_name', 'El apellido es requerido').notEmpty();
			req.assert('first_name', 'El nombre es requerido').notEmpty();
		}

		req.logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.debug('Searching for existing user');
				req.models.users.find({email_address: email_address}, function(err,user) {
					if(err) {
						return callback(err);
					}
					req.logger.debug('Is registration:'+is_registration+' y user length:'+user.length);
					if(is_registration==='true') {
						if(user.length===1) {
							return callback('Usuario ya existente');
						}
						else {
							return callback(null,null);
						}
					}
					if(is_registration==='false') {
						if(user.length===0) {
							return callback('Usuario/Clave inválido');
						}
						else {
							return callback(null,user[0]);
						}
					}
					return callback('No se puede evaluar parametro is_registration');
				});
			}, 
			function(user,callback) {
				req.logger.debug('Creacion de usuario o login !');
				if(is_registration==='true') {
					req.logger.info('Creando user '+email_address);
					req.models.users.create({	email_address:	email_address,
												password:		cipher.encrypt(password), 
												role_id:		req.constants.CUSTOMER_ID,
												last_name:		last_name,
												first_name:		first_name},function(err,user) {
						return callback(err,user);
					});
				}

				if(is_registration==='false') {
					req.logger.info('Evaluando claves');
					if(user.password !== cipher.encrypt(password)) {
						return callback('Usuario/Clave inválido');
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
						callback(err);
					}
					req.logger.info('Complete session:'+JSON.stringify(req.usersession));
					return callback(err,user);
				});
			}
		], 
		function(err, user) {
			req.logger.debug('Finalizacion de registration');
			if(err) {
				req.logger.debug('Error por enviar al cliente:'+err);
				return utils.send_ajax_error(req,res,err);
			}
			else {
				req.logger.debug('Registracion o login exitoso !');
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
