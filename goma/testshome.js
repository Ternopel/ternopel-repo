'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger');

(function (testshome) {

	testshome.getPlainHome = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:3000")
					.get('/')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Bandas elásticas');
						expect(res.text).toExclude('Bolsa de banditas elásticas');
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

	testshome.getCategory = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:3000")
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
			if(err) {
				return done(err);
			}
			else {
				return done();
			}
		});
	};

	testshome.getNoExistingCategory = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:3000")
					.get('/no-existing-category')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Esta categoria no está más disponible');
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

	testshome.getProduct = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:3000")
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
			if(err) {
				return done(err);
			}
			else {
				return done();
			}
		});
	};

	testshome.getNoExistingProduct = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:3000")
					.get('/no-existing-category/no-existing-product')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Este producto no está más disponible');
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
