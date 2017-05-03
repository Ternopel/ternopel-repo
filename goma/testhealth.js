'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+"/../utils/config")();

(function (testhealth) {

	testhealth.getHealth = function (done) {
		logger.info('Executing get to server:');
		request("http://localhost:"+config.test_app_http_port)
			.get('/health')
			.expect(200)
			.end(function(err, res){
				expect(res.text).toBe('OK');
				return done(err);
			});
	};
	
})(module.exports);
