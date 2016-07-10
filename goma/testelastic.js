'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+"/../utils/config")();

(function (testelastic) {

	testelastic.getReindex = function (done) {
		
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
				logger.info('Executing elastic search reindex');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/elastic/reindex')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toBe('OK 9');
						return callback(err,res);
					});
			},
			function(res,callback) {
				var sleep = require('sleep');
				sleep.sleep(2);
				logger.info('Executing elastic search reindex');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/elastic/search/bolsas')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toBe('OK 6');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
})(module.exports);
