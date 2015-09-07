'use strict';

var cipher	= require('../../utils/cipher'),
	utils	= require('./utils'),
	ld		= require('lodash');

module.exports = {
	
	get_login: function(req, res, next) {
		req.logger.info("Getting login page");
		var pageinfo = ld.merge(req.pageinfo, { csrfToken: req.csrfToken() });
		res.render('login.html',pageinfo);
	},
	
	get_registration: function(req, res, next) {
		req.logger.info("Getting registration page");
		req.models.registrations.find({token:req.params.token},function(err,registrations) {
			if(err) {
				return next(err);
			}
			if(registrations.length===0) {
				return next('Su token es inválido !');
			}
			var registration = registrations[0];
			var pageinfo = ld.merge(req.pageinfo, { csrfToken: req.csrfToken(), email_address:registration.email_address });
			res.render('registration.html',pageinfo);
		});
	},
	
	get_mail_sent: function(req, res, next) {
		req.logger.info("Getting mail sent page");
		var pageinfo = ld.merge(req.pageinfo, { email: req.params.email });
		res.render('mailsent.html',pageinfo);
	},
	
	post_confirm: function(req, res, next) {

		var email_address	= req.body.email_address;
		var first_name		= req.body.first_name;
		var last_name		= req.body.last_name;
		var password		= req.body.password;
		req.logger.debug('User trying to register:'+req.body.email_address);
		
		req.logger.debug("Defining validators");
		req.assert('email_address', 'El email ingresado es incorrecto').isEmail();
		req.assert('password', 'La clave es requerida').notEmpty();
		req.assert('first_name', 'Nombre es requerido').notEmpty();
		req.assert('last_name', 'Apellido es requerido').notEmpty();

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
					if(user.length===1) {
						return callback('Usuario/Clave existente');
					}
					else {
						return callback(null,user[0]);
					}
				});
			}, 
			function(user,callback) {
				req.logger.info('Creando user '+email_address);
				req.models.users.create({	email_address:	email_address,
											password:		cipher.encrypt(password), 
											role_id:		req.constants.CUSTOMER_ID,
											last_name:		last_name,
											first_name:		first_name},function(err,user) {
					return callback(err,user);
				});				
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
			req.logger.debug('Finalizacion de creacion de usuario');
			if(err) {
				req.logger.debug('Error por enviar al cliente:'+err);
				return utils.send_ajax_error(req,res,err);
			}
			else {
				req.logger.debug('Login exitoso !');
				return res.status(200).send('success_client');
			}
		});
	},	
	
	
	
	
	
	
	
	post_login: function(req, res, next) {

		var email_address	= req.body.email_address;
		var password		= req.body.password;
		req.logger.debug('User trying to register:'+req.body.email_address);
		
		req.logger.debug("Defining validators");
		req.assert('email_address', 'El email ingresado es incorrecto').isEmail();
		req.assert('password', 'La clave es requerida').notEmpty();

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
					if(user.length===0) {
						return callback('Usuario/Clave inválido');
					}
					else {
						return callback(null,user[0]);
					}
				});
			}, 
			function(user,callback) {
				req.logger.debug('Login !');
				req.logger.info('Evaluando claves');
				if(user.password !== cipher.encrypt(password)) {
					return callback('Usuario/Clave inválido');
				}
				else {
					return callback(null,user);
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
			req.logger.debug('Finalizacion de login');
			if(err) {
				req.logger.debug('Error por enviar al cliente:'+err);
				return utils.send_ajax_error(req,res,err);
			}
			else {
				req.logger.debug('Login exitoso !');
				if(user.isAdmin()) {
					return res.status(200).send('success_admin');
				}
				if(!user.isAdmin()) {
					return res.status(200).send('success_client');
				}
			}
		});
	},
	
	post_registration: function(req, res, next) {
		
		var email_address	= req.body.registration_email_address;
		req.logger.debug('User trying to register:'+req.body.registration_email_address);
		
		req.logger.debug("Defining validators");
		req.assert('registration_email_address', 'El email ingresado es incorrecto').isEmail();
		
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
					if(user.length===1) {
						return callback('Usuario ya existente');
					}
					else {
						return callback(null,null);
					}
				});
			}, 
			function(user,callback) {
				req.logger.debug('Registracion de usuario !');
				req.logger.info('Registrando user '+email_address);
				var token	= require('node-uuid').v1();
				req.models.registrations.create({	email_address:	email_address, token:token, sent:false },function(err,registration) {
					return callback(err,registration);
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
				req.logger.debug('Registracion exitosa !');
				return res.status(200).send(email_address);
			}
		});
	}
};
