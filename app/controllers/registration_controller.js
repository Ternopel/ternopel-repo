'use strict';

var cipher	= require('../../utils/cipher'),
	utils	= require('./utils'),
	ld		= require('lodash'),
	logger	= require("../../utils/logger")(module);


function save_email(req, res, next, email_field, email_address, is_registration) {

	logger.info("Saving email");
	var mailing_read_privacy	= req.body.mailing_read_privacy;
	logger.debug('User trying to register:'+email_address);
	
	logger.debug("Defining validators");
	req.assert(email_field, 'El email ingresado es incorrecto').isEmail();
	if(is_registration===false) {
		req.assert('mailing_read_privacy', 'Debe marcar que ha leído las Políticas de Privacidad').notEmpty();
	}
	
	logger.info("Executing validation");
	var valerrors = req.validationErrors();
	if(valerrors) {
		return utils.send_ajax_validation_errors(req,res,valerrors);
	}
	
	var waterfall = require('async-waterfall');
	waterfall([ 
		function(callback) {
			logger.debug('Searching for existing user');
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
			var token	= require('node-uuid').v1();
			if(is_registration===true) {
				logger.debug('Registracion de usuario !');
				logger.info('Registrando user '+email_address);
				req.models.registrations.create({	email_address:	email_address, token:token, verified:false, sent:false },function(err,registration) {
					return callback(err,registration);
				});
			}
			else {
				logger.debug('Mailing de usuario !');
				logger.info('Mailing user '+email_address);
				req.models.mailing.create({	email_address:	email_address, token:token, verified:false, sent:false },function(err,mailing) {
					return callback(err,mailing);
				});
			}
		}
	], 
	function(err, user) {
		logger.debug('Finalizacion de registration');
		if(err) {
			logger.debug('Error por enviar al cliente:'+err);
			return utils.send_ajax_error(req,res,err);
		}
		else {
			logger.debug('Registracion exitosa '+email_address);
			return res.status(200).send(email_address);
		}
	});
}

module.exports = {
	
	get_login: function(req, res, next) {
		logger.info("Getting login page");
		var pageinfo = ld.merge(req.pageinfo, { csrfToken: req.csrfToken() });
		res.render('login.html',pageinfo);
	},
	
	get_registration: function(req, res, next) {
		logger.info("Getting registration page");
		req.models.registrations.find({token:req.params.token},function(err,registrations) {
			if(err) {
				return next(err);
			}
			if(registrations.length===0) {
				return next('Su token es inválido !');
			}
			var registration = registrations[0];
			registration.verified = true;
			registration.save(function(err) {
				if(err) {
					return next(err);
				}
				var pageinfo = ld.merge(req.pageinfo, { csrfToken: req.csrfToken(), email_address:registration.email_address });
				res.render('registration.html',pageinfo);
			});
		});
	},
	
	get_mailing: function(req, res, next) {
		logger.info("Getting mailing page");
		req.models.mailing.find({token:req.params.token},function(err,mailings) {
			if(err) {
				return next(err);
			}
			if(mailings.length===0) {
				return next('Su token es inválido !');
			}
			var mailing = mailings[0];
			mailing.verified = true;
			mailing.save(function(err) {
				if(err) {
					return next(err);
				}
				var pageinfo = ld.merge(req.pageinfo, { csrfToken: req.csrfToken(), message: 'Se enviarán listados de precios semanales a <b>'+mailing.email_address+'</b>' });
				res.render('mailsent.html',pageinfo);
			});
		});
	},
	
	get_mail_sent: function(req, res, next) {
		logger.info("Getting mail sent page");
		var pageinfo = ld.merge(req.pageinfo, { message: 'Se ha enviado un correo de confirmación a <b>'+req.params.email+'</b>' , csrfToken: req.csrfToken() });
		res.render('mailsent.html',pageinfo);
	},
	
	post_confirm: function(req, res, next) {

		var email_address	= req.body.email_address;
		var first_name		= req.body.first_name;
		var last_name		= req.body.last_name;
		var password		= req.body.password;
		logger.debug('User trying to register:'+req.body.email_address);
		
		logger.debug("Defining validators");
		req.assert('email_address', 'El email ingresado es incorrecto').isEmail();
		req.assert('password', 'La clave es requerida').notEmpty();
		req.assert('first_name', 'Nombre es requerido').notEmpty();
		req.assert('last_name', 'Apellido es requerido').notEmpty();

		logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.debug('Searching for existing user');
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
				logger.info('Creando user '+email_address);
				req.models.users.create({	email_address:	email_address,
											password:		cipher.encrypt(password), 
											role_id:		req.constants.CUSTOMER_ID,
											last_name:		last_name,
											first_name:		first_name},function(err,user) {
					return callback(err,user);
				});				
			},
			function(user,callback) {
				logger.info('Assigning user to session');
				req.usersession.setUser(user,function(err) {
					if(err) {
						callback(err);
					}
					logger.info('Complete session:'+JSON.stringify(req.usersession));
					return callback(err,user);
				});
			}
		], 
		function(err, user) {
			logger.debug('Finalizacion de creacion de usuario');
			if(err) {
				logger.debug('Error por enviar al cliente:'+err);
				return utils.send_ajax_error(req,res,err);
			}
			else {
				logger.debug('Login exitoso !');
				return res.status(200).send('success_client');
			}
		});
	},	
	
	post_login: function(req, res, next) {

		var email_address	= req.body.email_address;
		var password		= req.body.password;
		logger.debug('User trying to register:'+req.body.email_address);
		
		logger.debug("Defining validators");
		req.assert('email_address', 'El email ingresado es incorrecto').isEmail();
		req.assert('password', 'La clave es requerida').notEmpty();

		logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.debug('Searching for existing user');
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
				logger.debug('Login !');
				logger.info('Evaluando claves');
				if(user.password !== cipher.encrypt(password)) {
					return callback('Usuario/Clave inválido');
				}
				else {
					return callback(null,user);
				}
			},
			function(user,callback) {
				logger.info('Assigning user to session');
				req.usersession.setUser(user,function(err) {
					if(err) {
						callback(err);
					}
					logger.info('Complete session:'+JSON.stringify(req.usersession));
					return callback(err,user);
				});
			}
		], 
		function(err, user) {
			logger.debug('Finalizacion de login');
			if(err) {
				logger.debug('Error por enviar al cliente:'+err);
				return utils.send_ajax_error(req,res,err);
			}
			else {
				logger.debug('Login exitoso !');
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
		return save_email(req, res, next, 'regis_email_address', req.body.regis_email_address, true);
	},
	
	post_mailing: function(req, res, next) {
		logger.info("Receiving post");
		return save_email(req, res, next, 'email_address', req.body.email_address, false);
	}
};
