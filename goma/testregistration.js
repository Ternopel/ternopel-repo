'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+"/../utils/config")();

(function (testsregistration) {
	

	testsregistration.confirmUser = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/registration/3041bd90-5397-11e5-9650-9bf126a5d211')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Su token es inválido !');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/registration/3041bd90-5397-11e5-9650-9bf126a5d21f')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('demostenes1509@gmail.com');
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
				.get('/mailing/3041bd90-5397-11e5-9650-9bf126a5d21f')
				.expect(200)
				.end(function(err, res){
					expect(res.text).toInclude('demostenes1509@gmail.com');
					return callback(err,res);
				});
			}, 
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
				.get('/mailing/3041bd90-5397-11e5-9650-9bf126a5d299')
				.expect(200)
				.end(function(err, newres){
					expect(newres.text).toInclude('Su token es inválido !');
					return callback(err,res);
				});
			}, 
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/confirm')
					.set('cookie', utils.getcookies(res))
					.send({
						'first_name' : 'Nicasio',
						'last_name' : 'Oronio',
						'email_address' : 'mcarrizo@gmail.com',
						'password' : 'nicasio',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Usuario/Clave existente');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/confirm')
					.set('cookie', utils.getcookies(res))
					.send({
						'first_name' : 'Nicasio',
						'last_name' : 'Oronio',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El email ingresado es incorrecto');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/confirm')
					.set('cookie', utils.getcookies(res))
					.send({
						'first_name' : 'Nicasio',
						'last_name' : 'Oronio',
						'email_address' : 'demostenes1509@gmail.com',
						'password' : 'nicasio',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success_client');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/')
					.set('cookie', utils.getcookies(res))
					.end(function(err, res){
						expect(res.text).toInclude('Nicasio Oronio');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
				.get('/logout')
				.expect(302)
				.end(function(err, res){
					return callback(err);
				});
			},
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/login')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/login')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'demostenes1509@gmail.com',
						'password' : 'nicasio',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success_client');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/')
					.set('cookie', utils.getcookies(res))
					.end(function(err, res){
						expect(res.text).toInclude('Nicasio Oronio');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};


	
	testsregistration.registerNewUserFieldsRequired = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/login')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/registration')
					.set('cookie', utils.getcookies(res))
					.send({
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El email ingresado es incorrecto');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};	

	testsregistration.loginInvalidUsernamePassword = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/login')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/login')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'nicasio@gmail.com',
						'password' : 'nicasio',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Usuario/Clave inválido');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/login')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'nicasio@gmail.com',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('La clave es requerida');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/login')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'mcarrizo@gmail.com',
						'password' : 'nicasio',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Usuario/Clave inválido');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};	
	
	testsregistration.adminLogin = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/login')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/login')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'mcarrizo@ternopel.com',
						'password' : 'maxi',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success_admin');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/')
					.set('cookie', utils.getcookies(res))
					.end(function(err, res){
						expect(res.text).toInclude('Maxi Admin');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};	
	
	testsregistration.clientLogin = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/login')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/login')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'mcarrizo@gmail.com',
						'password' : 'maxito',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Usuario/Clave inválido');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/login')
					.set('cookie', utils.getcookies(res))
					.send({
						'password' : 'maxito',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El email ingresado es incorrecto');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/login')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'mcarrizo1@gmail.com',
						'password' : 'maxito',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Usuario/Clave inválido');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/login')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'mcarrizo@gmail.com',
						'password' : 'maxi',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success_client');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/')
					.set('cookie', utils.getcookies(res))
					.end(function(err, res){
						expect(res.text).toInclude('Maxi Client');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing logout to server');
				request("http://localhost:"+config.test_app_port)
				.get('/logout')
				.expect(302)
				.end(function(err, res){
					return callback(err);
				});
			}
		], 
		function(err) {
			return done(err);
		});
	};		
	
	testsregistration.registerNewUser = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/login')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/registration')
					.set('cookie', utils.getcookies(res))
					.send({
						'regis_email_address' : 'mcarrizo@gmail.com',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Usuario ya existente');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/registration')
					.set('cookie', utils.getcookies(res))
					.send({
						'regis_email_address' : 'nicasio@gmail.com',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('nicasio@gmail.com');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/mailsent/nicasio@gmail.com')
					.end(function(err, newres){
						expect(newres.text).toInclude('Se ha enviado un correo de confirmación a <b>nicasio@gmail.com</b>');
						return callback(err,res);
					});
			} 
		], 
		function(err) {
			return done(err);
		});
	};	

	testsregistration.registerNewMailingUser = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/login')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/mailing')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'mcarrizo@gmail.com',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Debe marcar que ha leído las Políticas de Privacidad');
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/mailing')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'nicasio@gmail.com',
						'mailing_read_privacy' : 'true',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('nicasio@gmail.com');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/mailsent/nicasio@gmail.com')
					.end(function(err, newres){
						expect(newres.text).toInclude('Se ha enviado un correo de confirmación a <b>nicasio@gmail.com</b>');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};	
	
	
	testsregistration.adminWithNoPermissions = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Usted no tiene permisos para ver esta página');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};	

	
	
})(module.exports);
