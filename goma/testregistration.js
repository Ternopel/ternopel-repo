'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")();

(function (testsregistration) {

	/*
	testsregistration.registerNewUser = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/registration')
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
						'first_name' : 'Nicasio',
						'last_name' : 'Oronio',
						'email_address' : 'nicasio@gmail.com',
						'password' : 'nicasio',
						'confirm_password' : 'nicasio',
						'_csrf' : utils.getcsrf(res),
						'is_registration': 'true'
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
					.post('/registration')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'nicasio@gmail.com',
						'password' : 'nicasio',
						'_csrf' : utils.getcsrf(res),
						'is_registration': 'false'
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
	*/
	
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
						'registration_email_address' : 'mcarrizo@gmail.com',
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
						'registration_email_address' : 'nicasio@gmail.com',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success_registration');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/registration')
					.set('cookie', utils.getcookies(res))
					.send({
						'registration_email_address' : 'nicasio@gmail.com',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Usuario ya registrado para confirmar');
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
