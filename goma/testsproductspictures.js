'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+"/../utils/config")(),
	fs			= require('fs');

(function (testsproductspictures) {

	testsproductspictures.createProductPicture = function (done) {

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
				logger.info('Creating product picture');
				fs.readFile(__dirname + '/logo1.png', function (err, data) {
					var base64data = new Buffer(data).toString('base64');
					request("http://localhost:"+config.test_app_http_port)
						.post('/admin/productspictures?_csrf='+utils.getcsrf(res))
						.set('cookie', utils.getcookies(res))
						.field('product_id', '1')
						.field('picture_id', '0')
						.field('type', 'image/png')
						.field('data', base64data)
						.expect(200)
						.end(function(err,newres) {
							expect(newres.text).toBe('/bandas-elasticas/bolsa-bandas-elasticas');
							return callback(err,res);
						});
				});
			},
			function(res,callback) {
				logger.info('Creating product picture');
				fs.readFile(__dirname + '/logo1.png', function (err, data) {
					var base64data = new Buffer(data).toString('base64');
					request("http://localhost:"+config.test_app_http_port)
					.post('/admin/productspictures?_csrf='+utils.getcsrf(res))
					.set('cookie', utils.getcookies(res))
					.field('picture_id', '0')
					.field('type', 'image/png')
					.field('data', base64data)
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El producto es requerido');
						return callback(err,res);
					});
				});
			},
			function(res,callback) {
				logger.info('Updating product picture');
				fs.readFile(__dirname + '/logo1.png', function (err, data) {
					var base64data = new Buffer(data).toString('base64');
					request("http://localhost:"+config.test_app_http_port)
						.post('/admin/productspictures?_csrf='+utils.getcsrf(res))
						.set('cookie', utils.getcookies(res))
						.field('product_id', '1')
						.field('picture_id', '1')
						.field('type', 'image/png')
						.field('data', base64data)
						.expect(200)
						.end(function(err,newres) {
							expect(newres.text).toBe('/bandas-elasticas/bolsa-bandas-elasticas');
							return callback(err,res);
						});
				});
			},
			function(res,callback) {
				logger.info('Getting product picture');
				request("http://localhost:"+config.test_app_http_port)
				.get('/images/products/1')
				.expect(200)
				.end(function(err,newres) {
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting product picture');
				request("http://localhost:"+config.test_app_http_port)
				.get('/images/productspictures/1')
				.expect(200)
				.end(function(err,newres) {
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting product picture');
				request("http://localhost:"+config.test_app_http_port)
				.get('/images/productspictures/10')
				.expect(200)
				.end(function(err,newres) {
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting non existing product picture with default picture');
				request("http://localhost:"+config.test_app_http_port)
				.get('/images/products/2')
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
	
	
})(module.exports);
