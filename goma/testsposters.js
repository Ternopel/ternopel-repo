'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")(),
	fs			= require('fs');

(function (testsposters) {

	testsposters.createPoster = function (done) {

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
				logger.info('Posting info to server:'+utils.getcsrf(res));
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
				logger.info('Creating poster');
				fs.readFile(__dirname + '/logo1.jpg', function (err, data) {
					if(err) {
						return callback(err,res);
					}
					request("http://localhost:"+config.test_app_port)
						.put('/admin/posters')
						.set('cookie', utils.getcookies(res))
						.send({
							'is_product' : 'true',
							'product_id' : '1',
							'position' : '1',
							'data' : data,
							'_csrf' : utils.getcsrf(res)
						})
						.expect(500)
						.end(function(err,newres) {
							expect(newres.text).toInclude('Por favor, cargue el archivo');
							return callback(err,res);
						});
				});
			},
			function(res,callback) {
				logger.info('Creating poster');
				fs.readFile(__dirname + '/logo1.jpg', function (err, data) {
					if(err) {
						return callback(err,res);
					}
					request("http://localhost:"+config.test_app_port)
					.put('/admin/posters')
					.set('cookie', utils.getcookies(res))
					.send({
						'is_product' : 'true',
						'product_id' : '1',
						'position' : '1',
						'type' : 'image/jpeg',
						'data' : data,
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('created');
						return callback(err,res);
					});
				});
			},
			function(res,callback) {
				logger.info('Creating poster');
				fs.readFile(__dirname + '/logo1.jpg', function (err, data) {
					if(err) {
						return callback(err,res);
					}
					request("http://localhost:"+config.test_app_port)
					.put('/admin/posters')
					.set('cookie', utils.getcookies(res))
					.send({
						'is_product' : 'false',
						'category_id' : '1',
						'position' : '1',
						'type' : 'image/jpeg',
						'data' : data,
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El valor asignado al orden existe en otro cartel (1)');
						return callback(err,res);
					});
				});
			},
			function(res,callback) {
				logger.info('Creating poster');
				fs.readFile(__dirname + '/logo1.jpg', function (err, data) {
					if(err) {
						return callback(err,res);
					}
					request("http://localhost:"+config.test_app_port)
					.put('/admin/posters')
					.set('cookie', utils.getcookies(res))
					.send({
						'is_product' : 'false',
						'category_id' : '1',
						'position' : '2',
						'type' : 'image/jpeg',
						'data' : data,
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('created');
						return callback(err,res);
					});
				});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/posters')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
				.get('/admin/posters/picture/2')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err, newres){
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
				.get('/admin/posters/add')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err, newres){
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
				.delete('/admin/posters')
				.set('cookie', utils.getcookies(res))
				.send({
						'id' : '1',
						'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err, res){
					return callback(err,res);
				});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	
})(module.exports);
