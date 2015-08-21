'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")();

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
				logger.info('Creating product picture:'+utils.getcsrf(res));
				request("http://localhost:"+config.test_app_port)
					.post('/admin/productspictures?_csrf='+utils.getcsrf(res))
					.set('cookie', utils.getcookies(res))
					.field('id', '1')
					.expect(200)
					.attach('picture',  __dirname + '/logo1.png')
					.end(function(err,newres) {
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Creating product picture:'+utils.getcsrf(res));
				request("http://localhost:"+config.test_app_port)
				.post('/admin/productspictures?_csrf='+utils.getcsrf(res))
				.set('cookie', utils.getcookies(res))
				.field('id', '1')
				.expect(200)
				.attach('picture',  __dirname + '/logo2.png')
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
