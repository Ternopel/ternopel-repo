'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+"/../utils/config")();

(function (testcontact) {

	testcontact.getContactUnloggedIn = function (done) {
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
				logger.info('Getting contact unlogged in');
				request("http://localhost:"+config.test_app_port)
				.get('/contact')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err,newres) {
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/contact')
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
				.post('/contact')
				.set('cookie', utils.getcookies(res))
				.send({
					'email_address' : 'goma@gmail.com',
					'first_name' : 'Nicasio',
					'last_name' : 'Oronio',
					'comments' : 'Comentario',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('success');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting contact unlogged in');
				request("http://localhost:"+config.test_app_port)
				.get('/contact/messagesent')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err,newres) {
					return callback(err,res);
				});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	
	testcontact.getContactLoggedIn = function (done) {
		
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
					.get('/contact')
					.set('cookie', utils.getcookies(res))
					.end(function(err, newres){
						expect(newres.text).toInclude('Maxi Admin');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
					.post('/contact')
					.set('cookie', utils.getcookies(res))
					.send({
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Su consulta es requerida');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Posting info to server');
				request("http://localhost:"+config.test_app_port)
				.post('/contact')
				.set('cookie', utils.getcookies(res))
				.send({
					'comments' : 'Comentario',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('success');
					return callback(err,res);
				});
			}, 
			
			
		], 
		function(err) {
			return done(err);
		});
	};	
	
	
})(module.exports);
