'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")();

(function (testsregistration) {

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
				.expect(301)
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
						'email_address' : 'nicasio@gmail.com',
						'password' : 'nicasio',
						'confirm_password' : 'nicasio',
						'_csrf' : utils.getcsrf(res),
						'is_registration': 'true'
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El apellido es requerido');
						expect(newres.text).toInclude('El nombre es requerido');
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
					.post('/registration')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'nicasio@gmail.com',
						'password' : 'nicasio',
						'_csrf' : utils.getcsrf(res),
						'is_registration': 'false'
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
					.post('/registration')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'mcarrizo@gmail.com',
						'password' : 'nicasio',
						'_csrf' : utils.getcsrf(res),
						'is_registration': 'false'
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
					.post('/registration')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'mcarrizo@ternopel.com',
						'password' : 'maxi',
						'_csrf' : utils.getcsrf(res),
						'is_registration': 'false'
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
	
	testsregistration.registerExistingUser = function (done) {
		
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
						'first_name' : 'Maximiliano',
						'last_name' : 'Carrizo',
						'email_address' : 'mcarrizo@gmail.com',
						'password' : 'maxito',
						'confirm_password' : 'maxito',
						'_csrf' : utils.getcsrf(res),
						'is_registration': 'true'
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Usuario ya existente');
						return callback(err,res);
					});
			},			
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
