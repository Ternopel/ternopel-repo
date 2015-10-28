'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")(),
	fs			= require('fs');

(function (testshoppingcart) {

	testshoppingcart.getPriceCalculation = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Getting price calculation');
				request("http://localhost:"+config.test_app_port)
					.get('/shoppingcart/pricecalculation')
					.expect(500)
					.end(function(err,res) {
						expect(res.text).toInclude('Id de Formato de Producto es requerido');
						expect(res.text).toInclude('Cantidad es requerida y numérica');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Getting price calculation');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart/pricecalculation?productformatid=1&quantity=A')
				.expect(500)
				.end(function(err,res) {
					expect(res.text).toExclude('Id de Formato de Producto es requerido');
					expect(res.text).toInclude('Cantidad es requerida y numérica');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting price calculation');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart/pricecalculation?productformatid=1&quantity=29')
				.expect(200)
				.end(function(err,res) {
					expect(res.text).toBe('1890.00');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting price calculation');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart/pricecalculation?productformatid=1&quantity=9')
				.expect(200)
				.end(function(err,res) {
					expect(res.text).toBe('630.00');
					return callback(err,res);
				});
			}
		], 
		function(err) {
			return done(err);
		});
	};

	testshoppingcart.addProductToCart = function (done) {
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
				logger.info('Getting products count for first time');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart/get_cart_count')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('0');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Adding product to cart');
				request("http://localhost:"+config.test_app_port)
					.post('/shoppingcart/addproducttocart')
					.set('cookie', utils.getcookies(res))
					.send({
						'productformatid' : '1',
						'quantity' : '9',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('1');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Adding product to cart');
				request("http://localhost:"+config.test_app_port)
				.post('/shoppingcart/addproducttocart')
				.set('cookie', utils.getcookies(res))
				.send({
					'productformatid' : '1',
					'quantity' : '9',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('2');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting products count for second time');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart/get_cart_count')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err,res) {
					expect(res.text).toBe('2');
					return callback(err,res);
				});
			}
		], 
		function(err) {
			return done(err);
		});
	};	
	
	
})(module.exports);
