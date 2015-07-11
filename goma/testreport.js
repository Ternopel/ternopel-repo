'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")();

(function (testreport) {

	testreport.getReport = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/report')
					.expect(200)
					.end(function(err, res){
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
