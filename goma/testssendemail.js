'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	cronconfig	= require('../utils/cronconfig.js'),
	models,
	db,
	config;

(function (testsendmail) {

	testsendmail.setMailInfo = function (pmodels,pdb,pconfig) {
		models	= pmodels;
		db		= pdb;
		config	= pconfig;
	};
	
	testsendmail.sendRegistrationMail = function (done) {
		cronconfig.sendregistrationmails(logger,config,models,function(err) {
			return done(err);
		});
	};
	
	testsendmail.sendMailingmails = function (done) {
		cronconfig.sendmailingmails(logger,config,models,function(err) {
			return done(err);
		});
	};
	
	testsendmail.sendPriceReportsMail = function (done) {
		cronconfig.sendpricereportsmail(logger,config,models,db,function(err) {
			return done(err);
		});
	};
	
	testsendmail.sendPurchaseMail = function (done) {
		cronconfig.sendpurchasemail(logger,config,models,function(err) {
			return done(err);
		});
	};
	
})(module.exports);
