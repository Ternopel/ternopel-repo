'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")();

(function (testshome) {

	testshome.getOffers = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_http_port)
					.get('/')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Bolsa de banditas elásticas');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_http_port)
					.get('/')
					.set('cookie', 'ter_token=notoken')
					.expect(200)
					.end(function(err, res){
						return callback(err,res);
					});
			}

		], 
		function(err) {
			return done(err);
		});
	};

	testshome.getSearch = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
		           function(callback) {
		        	   logger.info('Executing get to server');
		        	   request("http://localhost:"+config.test_app_http_port)
		        	   .get('/')
		        	   .expect(200)
		        	   .end(function(err, res){
		        		   expect(res.text).toInclude('Bolsa de banditas elásticas');
		        		   return callback(err,res);
		        	   });
		           },
		           function(res,callback) {
		        	   logger.info('Executing get to server');
		        	   request("http://localhost:"+config.test_app_http_port)
		        	   .get('/search/bolsa')
		        	   .set('cookie', 'ter_token=notoken')
		        	   .expect(200)
		        	   .end(function(err, res){
		        		   return callback(err,res);
		        	   });
		           }
		           
		           ], 
		           function(err) {
			return done(err);
		});
	};
	
	testshome.getCategory = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_http_port)
					.get('/bandas-elasticas')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Bandas elásticas');
						expect(res.text).toInclude('Bolsa de banditas elásticas');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};

	testshome.getNoExistingCategory = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_http_port)
					.get('/no-existing-category')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Esta categoria no está más disponible');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};

	testshome.getProduct = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_http_port)
					.get('/bandas-elasticas/bolsa-bandas-elasticas')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Bandas elásticas');
						expect(res.text).toInclude('Bolsa de banditas elásticas');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};

	testshome.getNoExistingProduct = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_http_port)
					.get('/no-existing-category/no-existing-product')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Este producto no está más disponible');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	testshome.getNoPosters = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
		           function(callback) {
		        	   logger.info('Executing get to server');
		        	   request("http://localhost:"+config.test_app_http_port)
		        	   .get('/?posters=false')
		        	   .expect(200)
		        	   .end(function(err, res){
		        		   return callback(err,res);
		        	   });
		           }
		           ], 
		           function(err) {
			return done(err);
		});
	};
	
})(module.exports);
