'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+"/../utils/config")();

(function (testscategories) {

	testscategories.getCategories = function (done) {

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
					.get('/admin')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, newres){
						expect(newres.text).toInclude('Gestión de Categorías');
						expect(newres.text).toInclude('Gestión de Productos');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/admin/categories')
					.set('cookie', utils.getcookies(res))
					.expect(200)
					.end(function(err, res){
						expect(res.text).toInclude('Agregar Categoría');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};

	testscategories.deleteCategory = function (done) {

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
				logger.info('Deleting category');
				request("http://localhost:"+config.test_app_port)
					.delete('/admin/categories')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '6',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success');
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Deleting category');
				request("http://localhost:"+config.test_app_port)
					.delete('/admin/categories')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Esta categoría tiene 1 productos asociados');
						expect(newres.text).toInclude('Borre primero los productos');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};

	testscategories.createCategory = function (done) {

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
				logger.info('Creating category');
				request("http://localhost:"+config.test_app_port)
					.put('/admin/categories')
					.set('cookie', utils.getcookies(res))
					.send({
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toInclude('A Insert Category Text here');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};


	testscategories.updateCategory = function (done) {

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
				logger.info('Updating category');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/categories')
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
				logger.info('Updating category');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/categories')
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
				logger.info('Updating category');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/categories')
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
				logger.info('Updating category');
				request("http://localhost:"+config.test_app_port)
					.post('/admin/categories')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'name',
						'colvalue' : 'Ensaladeras',
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
					.post('/admin/categories')
					.set('cookie', utils.getcookies(res))
					.send({
						'id' : '1',
						'colname' : 'url',
						'colvalue' : 'ensaladeras',
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
	
	
})(module.exports);
