'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")();

(function (testprivacy) {

	testprivacy.getPrivacy = function (done) {
		logger.info('Executing get to server');
		request("http://localhost:"+config.test_app_http_port)
			.get('/privacy/datapolicy')
			.expect(200)
			.end(function(err, res){
				expect(res.text).toInclude('Declaración de Política de Privacidad de PapeleraTernopel');
				return done(err);
			});
	};
	
})(module.exports);
