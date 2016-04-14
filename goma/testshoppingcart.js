'use strict';

var request		= require('supertest'),
	expect		= require('expect'),
	utils		= require('../utils/testutils.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+"/../utils/config")(),
	fs			= require('fs');

(function (testshoppingcart) {

	testshoppingcart.getPriceCalculation = function (done) {

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Getting price calculation ONE');
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
				logger.info('Getting price calculation TWO');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart/pricecalculation?productformatid=1&quantity=A&incart=false')
				.expect(500)
				.end(function(err,newres) {
					expect(newres.text).toExclude('Id de Formato de Producto es requerido');
					expect(newres.text).toInclude('Cantidad es requerida y numérica');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting price calculation THREE');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart/pricecalculation?productformatid=1&quantity=29&incart=false')
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('7250.00');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting price calculation FOUR');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart/pricecalculation?productformatid=1&quantity=9&incart=false')
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('2250.00');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Getting price calculation FIVE');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart/pricecalculation?productformatid=1&quantity=7&incart=true')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('1750.00');
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
					expect(newres.text).toBe('2');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Adding first product to cart');
				request("http://localhost:"+config.test_app_port)
					.post('/shoppingcart/addproducttocart')
					.set('cookie', utils.getcookies(res))
					.send({
						'productformatid' : '3',
						'quantity' : '9',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('3');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Adding second product to cart');
				request("http://localhost:"+config.test_app_port)
				.post('/shoppingcart/addproducttocart')
				.set('cookie', utils.getcookies(res))
				.send({
					'productformatid' : '4',
					'quantity' : '9',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('4');
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
					expect(res.text).toBe('4');
					return callback(err,res);
				});
			}
		], 
		function(err) {
			return done(err);
		});
	};	
	
	testshoppingcart.getShoppingCartUnloggedIn = function (done) {
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
				logger.info('Getting shopping cart unlogged in');
				request("http://localhost:"+config.test_app_port)
				.get('/shoppingcart')
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err,newres) {
					return callback(err,res);
				});
			},
		], 
		function(err) {
			return done(err);
		});

	};		
	
	testshoppingcart.getShoppingCartLoggedIn = function (done) {
		
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
					.get('/shoppingcart')
					.set('cookie', utils.getcookies(res))
					.end(function(err, res){
						expect(res.text).toInclude('Maxi Admin');
						return callback(err,res);
					});
			}
		], 
		function(err) {
			return done(err);
		});
	};	
	
	testshoppingcart.deleteShoppingCart = function (done) {
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
				logger.info('Delete shopping cart element');
				request("http://localhost:"+config.test_app_port)
				.delete('/shoppingcart/deleteshoppingcart')
				.send({
						'shopping_cart_id' : '1',
						'_csrf' : utils.getcsrf(res)
				})
				.set('cookie', utils.getcookies(res))
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toInclude('OK');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Delete shopping cart element');
				request("http://localhost:"+config.test_app_port)
				.delete('/shoppingcart/deleteshoppingcart')
				.send({
						'shopping_cart_id' : '10',
						'_csrf' : utils.getcsrf(res)
				})
				.set('cookie', utils.getcookies(res))
				.expect(500)
				.end(function(err,newres) {
					expect(newres.text).toInclude('Not found');
					return callback(err,res);
				});
			}

		], 
		function(err) {
			return done(err);
		});
	};	
	
	
	testshoppingcart.purchaseWithRegistration = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Post purchase with empty fields');
				request("http://localhost:"+config.test_app_port)
					.post('/shoppingcart/executepurchase')
					.set('cookie', utils.getcookies(res))
					.send({
						'email_address' : 'register@gmail.com',
						'password' : 'maxito',
						'first_name' : 'Max',
						'last_name' : 'Register',
						'address' : 'Malabia',
						'city' : 'CABA',
						'telephone' : '11-232-232',
						'zipcode' : '3',
						'state' : '3',
						'delivery_type' : '3',
						'payment_type' : '3',
						'already_registered' : 'false',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(500)
					.end(function(err,newres) {
						expect(newres.text).toInclude('Debe marcar que ha leído las Políticas de Privacidad');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Register an existing user');
				request("http://localhost:"+config.test_app_port)
				.post('/shoppingcart/executepurchase')
				.set('cookie', utils.getcookies(res))
				.send({
					'email_address' : 'mcarrizo@gmail.com',
					'password' : 'nicasio',
					'first_name' : 'Max',
					'last_name' : 'Register',
					'address' : 'Malabia',
					'city' : 'CABA',
					'telephone' : '11-232-232',
					'zipcode' : '3',
					'state' : '3',
					'delivery_type' : '3',
					'payment_type' : '3',
					'already_registered' : 'false',
					'purchase_conditions':'true',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(500)
				.end(function(err,newres) {
					expect(newres.text).toInclude('Usuario/Clave existente');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Post purchase with empty fields');
				request("http://localhost:"+config.test_app_port)
				.post('/shoppingcart/executepurchase')
				.set('cookie', utils.getcookies(res))
				.send({
					'email_address' : 'register@gmail.com',
					'password' : 'maxito',
					'first_name' : 'Max',
					'last_name' : 'Register',
					'address' : 'Malabia',
					'city' : 'CABA',
					'telephone' : '11-232-232',
					'zipcode' : '3',
					'state' : '3',
					'delivery_type' : '3',
					'payment_type' : '3',
					'already_registered' : 'false',
					'purchase_conditions':'true',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toInclude('OK');
					return callback(err,res);
				});
			}
		], 
		function(err) {
			return done(err);
		});
	};	
	
	
	testshoppingcart.purchaseWithLogin = function (done) {
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Executing get to server');
				request("http://localhost:"+config.test_app_port)
					.get('/')
					.end(function(err, res){
						return callback(err,res);
					});
			}, 
			function(res,callback) {
				logger.info('Register an existing user');
				request("http://localhost:"+config.test_app_port)
				.post('/shoppingcart/executepurchase')
				.set('cookie', utils.getcookies(res))
				.send({
					'email_address_reg' : 'mcarrizo@gmail.com',
					'password_reg' : 'nicasio',
					'address' : 'Malabia',
					'city' : 'CABA',
					'telephone' : '11-232-232',
					'zipcode' : '3',
					'state' : '3',
					'delivery_type' : '3',
					'payment_type' : '3',
					'already_registered' : 'true',
					'purchase_conditions':'true',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(500)
				.end(function(err,newres) {
					expect(newres.text).toInclude('Usuario/Clave inválido');
					return callback(err,res);
				});
			},
			function(res,callback) {
				logger.info('Register an existing user');
				request("http://localhost:"+config.test_app_port)
				.post('/shoppingcart/executepurchase')
				.set('cookie', utils.getcookies(res))
				.send({
					'email_address_reg' : 'mcarrizo@gmail.com',
					'password_reg' : 'maxi',
					'address' : 'Malabia',
					'city' : 'CABA',
					'telephone' : '11-232-232',
					'zipcode' : '3',
					'state' : '3',
					'delivery_type' : '3',
					'payment_type' : '3',
					'already_registered' : 'true',
					'purchase_conditions':'true',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('OK');
					return callback(err,res);
				});
			}

		], 
		function(err) {
			return done(err);
		});
	};	
	

	testshoppingcart.purchaseLoggedIn = function (done) {
		
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
						'email_address' : 'mcarrizo@gmail.com',
						'password' : 'maxi',
						'_csrf' : utils.getcsrf(res)
					})
					.expect(200)
					.end(function(err,newres) {
						expect(newres.text).toBe('success_client');
						return callback(err,res);
					});
			},
			function(res,callback) {
				logger.info('Register an existing user');
				request("http://localhost:"+config.test_app_port)
				.post('/shoppingcart/executepurchase')
				.set('cookie', utils.getcookies(res))
				.send({
					'first_name_log' : 'Max',
					'last_name_log' : 'Register',
					'address' : 'Malabia',
					'city' : 'CABA',
					'telephone' : '11-232-232',
					'zipcode' : '3',
					'state' : '3',
					'delivery_type' : '3',
					'payment_type' : '3',
					'already_registered' : 'true',
					'purchase_conditions':'true',
					'_csrf' : utils.getcsrf(res)
				})
				.expect(200)
				.end(function(err,newres) {
					expect(newres.text).toBe('ERR');
					return callback(err,res);
				});
			}			
		], 
		function(err) {
			return done(err);
		});
	};		
	
	
	
	
	
	
})(module.exports);
