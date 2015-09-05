'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")(),
	cronconfig	= require('../utils/cronconfig.js'),
	models;

(function (testsendmail) {

	testsendmail.setModels = function (pmodels) {
		models = pmodels;
	};
	
	testsendmail.sendMail = function (done) {
		cronconfig.sendregistrationmails(logger,config,models,function(err) {
			return done(err);
		});
	};
	
})(module.exports);
