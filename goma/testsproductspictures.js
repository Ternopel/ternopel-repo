'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")(),
	fs			= require('fs');

(function (testsproductspictures) {

	testsproductspictures.createProductPicture = function (done) {

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
				fs.readFile(__dirname + '/logo1.jpg', function (err, data) {
					request("http://localhost:"+config.test_app_port)
						.post('/admin/productspictures?_csrf='+utils.getcsrf(res))
						.set('cookie', utils.getcookies(res))
						.field('product_id', '1')
						.field('type', 'image/jpeg')
						.field('data', data)
						.expect(200)
						.end(function(err,newres) {
							expect(newres.text).toBe('created');
							return callback(err,res);
						});
				});
			},
			function(res,callback) {
				logger.info('Updating product picture');
				fs.readFile(__dirname + '/logo1.jpg', function (err, data) {
					request("http://localhost:"+config.test_app_port)
						.post('/admin/productspictures?_csrf='+utils.getcsrf(res))
						.set('cookie', utils.getcookies(res))
						.field('product_id', '1')
						.field('type', 'image/jpeg')
						.field('data', data)
						.expect(200)
						.end(function(err,newres) {
							expect(newres.text).toBe('updated');
							return callback(err,res);
						});
				});
			},
			function(res,callback) {
				logger.info('Getting product picture');
				request("http://localhost:"+config.test_app_port)
				.get('/images/productspictures/1')
				.expect(200)
				.end(function(err,newres) {
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting non existing product picture with default picture');
				request("http://localhost:"+config.test_app_port)
				.get('/images/productspictures/2')
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
