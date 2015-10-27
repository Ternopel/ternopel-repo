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
				.get('/shoppingcart/pricecalculation?productformatid=1&quantity=1')
				.expect(200)
				.end(function(err,res) {
					expect(res.text).toBe('success');
					return callback(err,res);
				});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	
})(module.exports);
