'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+"/../utils/config")();

(function (testshome) {

	testshome.getOffers = function (done) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/')
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Bolsa de banditas elásticas');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
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
		        	   request("http://localhost:"+config.test_app_port)
		        	   .get('/')
		        	   .expect(200)
		        	   .end(function(err, res){
		        		   expect(res.text).toInclude('Bolsa de banditas elásticas');
		        		   return callback(err,res);
		        	   });
		           },
		           function(res,callback) {
		        	   logger.info('Executing get to server');
		        	   request("http://localhost:"+config.test_app_port)
		        	   .get('/search/bolsa%20camiseta%20%20%20reforzada')
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
				request("http://localhost:"+config.test_app_port)
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
				request("http://localhost:"+config.test_app_port)
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
				request("http://localhost:"+config.test_app_port)
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

	testshome.getProductAdminUser = function (done) {
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
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/bandas-elasticas/bolsa-bandas-elasticas')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Bandas elásticas');
						expect(res.text).toInclude('Bolsa de banditas elásticas');
						expect(res.text).toInclude('Editar Producto');
						expect(res.text).toInclude('Editar Formatos');
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
				request("http://localhost:"+config.test_app_port)
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
				request("http://localhost:"+config.test_app_port)
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
