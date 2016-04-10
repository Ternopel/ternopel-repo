'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+"/../utils/config")();

(function (testsproducts) {

	testsproducts.getProducts = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server suite 1');
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
				logger.info('Executing get add 1 to server ');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/add')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontró categoría del Producto');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get add 2 to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/add?categoryid=1')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('Alta de Producto');
						expect(newres.text).toInclude('Bandas elásticas');
						expect(newres.text).toExclude('Edición de Producto');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get edit 1 to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/edit')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontró Id del Producto');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get edit 2 to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/edit?productid=1')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('Edición de Producto');
						expect(newres.text).toInclude('Bandas elásticas');
						expect(newres.text).toExclude('Alta de Producto');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get edit 3 to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/edit?productid=4545')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('Producto con id:4545 no existente');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	testsproducts.getProductPicture = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server suite 2');
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
				logger.info('Executing get edit 1.1 to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/picture/edit')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontró Id de Imagen');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get edit 2.2 to server');
				request("http://localhost:"+config.test_app_port)
				.get('/admin/products/picture/edit?pictureid=1')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err, newres){
					expect(newres.text).toInclude('Gestión de Foto de Producto');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/picture/edit?pictureid=4545')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontró Imagen con id:4545');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	testsproducts.getProductFormats = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server suite 3');
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
				logger.info('Executing get edit format to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/formats/edit')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontró Id del Producto');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get edit format to server');
				request("http://localhost:"+config.test_app_port)
				.get('/admin/products/formats/edit?productid=1')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err, newres){
					expect(newres.text).toInclude('Gestión de Formatos de Producto');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Executing get edit format to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/formats/edit?productid=4545')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontró Producto con id:4545');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};	
	
	testsproducts.deleteProduct = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server suite 4');
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
						'id' : '900',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Not found');
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Deleting product');
				request("http://localhost:"+config.test_app_port)
					.delete('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '7',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Este producto tiene 52 formatos asociados');
						expect(newres.text).toInclude('Borre primero los formatos');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	testsproducts.createProduct = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server suite 5');
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
				logger.info('Creating product');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/add?categoryid=1')
					.set('cookie', utils.getcookies(res))
					.send({
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Creating product');
				request("http://localhost:"+config.test_app_port)
					.put('/admin/products/save')
					.set('cookie', utils.getcookies(res))
					.send({
						'category_id' : 1,
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Nombre es requerido');
						expect(newres.text).toInclude('Descripción es requerida');
						expect(newres.text).toInclude('Url es requerido');
						expect(newres.text).toInclude('Seleccione packaging');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Creating product');
				request("http://localhost:"+config.test_app_port)
					.put('/admin/products/save')
					.set('cookie', utils.getcookies(res))
					.send({
						'category_id' : 1,
						'packaging_id' : 1,
						'name' : 'Caja de madera',
						'description' : 'Nuevo SUPER Prod',
						'url' : 'productos-aluminio',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El valor asignado al nombre o url existe en otro registro');
						return callback(err,res);
					});
			},			
			function(res,callback) {
				logger.info('Creating product');
				request("http://localhost:"+config.test_app_port)
				.put('/admin/products/save')
				.set('cookie', utils.getcookies(res))
				.send({
					'category_id' : 1,
					'packaging_id' : 1,
					'name' : 'Nuevo Prod',
					'description' : 'Nuevo SUPER Prod',
					'url' : 'prod',
					'is_visible' : 'on',
					'is_offer' : 'on',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('/bandas-elasticas/prod');
					return callback(err,res);
				});
			}			
		], 
		function(err) {
			return done(err);
		});
	};
	
	testsproducts.updateProduct = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server suite 6');
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
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/edit?productid=1')
					.set('cookie', utils.getcookies(res))
					.send({
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/products/save')
					.set('cookie', utils.getcookies(res))
					.send({
						'category_id' : 1,
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Id es requerido');
						expect(newres.text).toInclude('Nombre es requerido');
						expect(newres.text).toInclude('Descripción es requerida');
						expect(newres.text).toInclude('Url es requerido');
						expect(newres.text).toInclude('Seleccione packaging');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Creating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/products/save')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : 999,
						'category_id' : 1,
						'packaging_id' : 1,
						'name' : 'Nuevo Prod 999',
						'description' : 'Nuevo SUPER Prod',
						'url' : 'prod 999',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Not found');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Creating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/products/save')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : 1,
						'category_id' : 1,
						'packaging_id' : 1,
						'name' : 'Nuevo Prod',
						'description' : 'Nuevo SUPER Prod',
						'url' : 'prod',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('/bandas-elasticas/prod');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Creating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/products/save')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : 1,
						'category_id' : 1,
						'packaging_id' : 1,
						'name' : 'Caja de madera',
						'description' : 'Nuevo SUPER Prod',
						'url' : 'productos-aluminio',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('El valor asignado al nombre o url existe en otro registro');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};

	testsproducts.getAdminProducts = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server suite 7');
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
					.get('/admin/products')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontró parámetro de búsqueda');
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
						expect(newres.text).toInclude('Bolsa de banditas elásticas');
						expect(newres.text).toExclude('Bolsas de consorcio');
						expect(newres.text).toExclude('Productos de Aluminio');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};

	
	testsproducts.updateAdminProduct = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server suite 8');
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
				logger.info('Updating product');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'name',
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
						'colname' : 'packaging_id',
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
					.post('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'category_id',
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
					.post('/admin/products')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'show_format',
						'colvalue' : 'true',
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
					'colname' : 'is_visible',
					'colvalue' : 'true',
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
					'colname' : 'is_offer',
					'colvalue' : 'true',
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
						'colname' : 'name',
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
						'colname' : 'name',
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
			return done(err);
		});
	};
	
	testsproducts.addProductPicture = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server suite 2');
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
				logger.info('Executing get edit 1.1 to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/picture/add')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontró Id del Producto');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get edit 2.2 to server');
				request("http://localhost:"+config.test_app_port)
				.get('/admin/products/picture/add?productid=1')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err, newres){
					expect(newres.text).toInclude('Gestión de Foto de Producto');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/products/picture/add?productid=4545')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('No se encontró Producto con id:4545');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};
	
	
	
})(module.exports);
