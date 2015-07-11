'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")();

(function (testsproducts) {

	testsproducts.getProducts = function (done) {

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
					.post('/registration')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'mcarrizo@ternopel.com',
						'password' : 'maxi',
						'_csrf' : utils.getcsrf(res),
						'is_registration': 'false'
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
					.get('/admin/products')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontro parámetro de búsqueda');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server111111111111');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products?search=')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Agregar Producto');
						expect(res.text).toInclude('Bolsa de banditas elásticas');
						expect(res.text).toInclude('Bolsas de consorcio');
						expect(res.text).toInclude('Productos de Aluminio');
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
