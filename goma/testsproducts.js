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
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products?search=')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('Agregar Producto');
						expect(newres.text).toInclude('Bolsa de banditas elásticas');
						expect(newres.text).toInclude('Bolsas de consorcio');
						expect(newres.text).toInclude('Productos de Aluminio');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products?search=elásticas')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('Agregar Producto');
						expect(newres.text).toInclude('Bolsa de banditas elásticas');
						expect(newres.text).toExclude('Bolsas de consorcio');
						expect(newres.text).toExclude('Productos de Aluminio');
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
	
	
	testsproducts.deleteProduct = function (done) {

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
				logger.info('Deleting product');
				request("http://localhost:"+config.test_app_port)
					.delete('/admin/products')
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
			}, 
			function(res,callback) {
				logger.info('Deleting product');
				request("http://localhost:"+config.test_app_port)
					.delete('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Este producto tiene 3 formatos asociados');
						expect(newres.text).toInclude('Borre primero los formatos');
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
	
	testsproducts.createProduct = function (done) {

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
				logger.info('Creating product');
				request("http://localhost:"+config.test_app_port)
					.put('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toInclude('A Insert Product Text here');
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
	
	testsproducts.updateProduct = function (done) {

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
					.post('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'description',
						'colvalue' : 'Nuevas bolsitas',
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
					.post('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'url',
						'colvalue' : 'nuevas-bolsitas',
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
					.post('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'description',
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
					.post('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'description',
						'colvalue' : 'Caja de madera',
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
					.post('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '2',
						'colname' : 'url',
						'colvalue' : 'bolsas-papel-sulfito',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El valor asignado a la columna existe en otro registro');
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
