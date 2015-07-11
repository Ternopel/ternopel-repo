'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")();

(function (testsproductsformats) {

	testsproductsformats.deleteProductFormat = function (done) {

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
				logger.info('Deleting product format');
				request("http://localhost:"+config.test_app_port)
					.delete('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '9',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success');
						return callback(err,res);
					});
			} 
		], 
		function(err) {
			return done(err);
		});
	};
	
	testsproductsformats.createProductFormat = function (done) {

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
				logger.info('Creating product Format');
				request("http://localhost:"+config.test_app_port)
					.put('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El producto es requerido');
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Creating product Format');
				request("http://localhost:"+config.test_app_port)
					.put('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'product_id' : '1',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toInclude('INS FORMAT');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	testsproductsformats.updateProductFormat = function (done) {

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
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'format',
						'colvalue' : 'Papas x 15',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'units',
						'colvalue' : '2',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'quantity',
						'colvalue' : '2',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'retail',
						'colvalue' : '2.30',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'wholesale',
						'colvalue' : '2.30',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'format',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El valor es requerido');
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'format',
						'colvalue' : 'BOLSA PP 5 X 20 CMS.',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El valor asignado a la columna existe en otro registro');
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Updating category');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/productsformats')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '2',
						'colname' : 'units',
						'colvalue' : 'A',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El valor es un entero');
						return callback(err,res);
					});
			} 
		], 
		function(err) {
			return done(err);
		});
	};

	
	
})(module.exports);
