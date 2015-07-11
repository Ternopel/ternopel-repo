'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger');

(function (testhealth) {

	testhealth.getHealth = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:3000")
					.get('/health')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toBe('OK');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			if(err) {
				return done(err);
			}
			else {
				return done();
			}
		});
	};
	
})(module.exports);
