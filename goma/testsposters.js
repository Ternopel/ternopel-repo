'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+"/../utils/config")(),
	fs			= require('fs');

(function (testsposters) {

	testsposters.createPoster = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_http_port)
					.get('/login')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Posting info to server:'+utils.getcsrf(res));
				request("http://localhost:"+config.test_app_http_port)
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
				logger.info('Creating poster 1');
				fs.readFile(__dirname + '/logo1.png', function (err, data) {
					var base64data = new Buffer(data).toString('base64');
					request("http://localhost:"+config.test_app_http_port)
						.put('/admin/posters')
						.set('cookie', utils.getcookies(res))
						.send({
							'is_product' : 'true',
							'product_id' : '1',
							'position' : '1',
							'data' : base64data,
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
				logger.info('Creating poster 2');
				fs.readFile(__dirname + '/logo1.png', function (err, data) {
					var base64data = new Buffer(data).toString('base64');
					request("http://localhost:"+config.test_app_http_port)
					.put('/admin/posters')
					.set('cookie', utils.getcookies(res))
					.send({
						'is_product' : 'true',
						'product_id' : '1_1',
						'position' : '1',
						'caption' : 'hola',
						'type' : 'image/jpeg',
						'data' : base64data,
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
				logger.info('Creating poster 3');
				fs.readFile(__dirname + '/logo1.png', function (err, data) {
					var base64data = new Buffer(data).toString('base64');
					request("http://localhost:"+config.test_app_http_port)
					.put('/admin/posters')
					.set('cookie', utils.getcookies(res))
					.send({
						'is_product' : 'false',
						'category_id' : '1',
						'position' : '1',
						'caption' : 'hola',
						'type' : 'image/jpeg',
						'data' : base64data,
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
				logger.info('Creating poster 4');
				fs.readFile(__dirname + '/logo1.png', function (err, data) {
					var base64data = new Buffer(data).toString('base64');
					request("http://localhost:"+config.test_app_http_port)
					.put('/admin/posters')
					.set('cookie', utils.getcookies(res))
					.send({
						'is_product' : 'false',
						'category_id' : '1',
						'position' : '2',
						'caption' : 'hola',
						'type' : 'image/jpeg',
						'data' : base64data,
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
				logger.info('Creating poster 5');
				fs.readFile(__dirname + '/logo2.png', function (err, data) {
					var base64data = new Buffer(data).toString('base64');
					request("http://localhost:"+config.test_app_http_port)
					.put('/admin/posters')
					.set('cookie', utils.getcookies(res))
					.send({
						'is_product' : 'true',
						'product_id' : '2_1',
						'position' : '3',
						'caption' : 'hola',
						'type' : 'image/jpeg',
						'data' : base64data,
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
				logger.info('Executing get 1 to server');
				request("http://localhost:"+config.test_app_http_port)
					.get('/admin/posters')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get 2 to server');
				request("http://localhost:"+config.test_app_http_port)
				.get('/images/posters/picture/3.jpg')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err, newres){
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Executing get 2 to server');
				request("http://localhost:"+config.test_app_http_port)
				.get('/images/posters/picture/30.jpg')
				.set('cookie', utils.getcookies(res))
				.expect(500)
				.end(function(err, newres){
					expect(newres.text).toInclude('Not found');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Executing get 3 to server');
				request("http://localhost:"+config.test_app_http_port)
				.get('/admin/posters/add')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err, newres){
					return callback(err,res);
				});
			}, 
			function(res,callback) {
				logger.info('Executing delete to server');
				request("http://localhost:"+config.test_app_http_port)
				.delete('/admin/posters')
				.set('cookie', utils.getcookies(res))
				.send({
						'id' : '3',
						'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err, newres){
					expect(newres.text).toBe('removed');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Executing delete to server');
				request("http://localhost:"+config.test_app_http_port)
				.delete('/admin/posters')
				.set('cookie', utils.getcookies(res))
				.send({
					'id' : '30',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(500)
				.end(function(err, newres){
					expect(newres.text).toInclude('Not found');
					return callback(err,res);
				});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	
})(module.exports);
