'use strict';

var cipher	= require('../../utils/cipher'),
	utils	= require('./utils'),
	ld		= require('lodash'),
	logger	= require("../../utils/logger")(module),
	math	= require('mathjs');


var validate_shopping_cart_params = function(req, res, incartval) {
	
	req.check('productformatid', 'Id de Formato de Producto es requerido').notEmpty();
	req.check('quantity', 'Cantidad es requerida y numérica').notEmpty().isInt();
	if(incartval===true) {
		req.check('incart', 'Indique si esta en carrito de compras').notEmpty().isBoolean();
	}
	
	logger.info("Validating fields");
	return req.validationErrors();
};

module.exports = {
		
	get_price: function(models, productformatid, quantity, callback) {
		
		logger.info("Calculating price");
		models.productsformats.get(productformatid,function(err,productformat) {
			if(err) {
				return callback(err);
			}
			var wholesale_price_units	= parseInt(quantity / productformat.quantity);
			var retail_price_units		= quantity - ( wholesale_price_units * productformat.quantity);
			logger.info("wholesale_price_units:"+wholesale_price_units);
			logger.info("retail_price_units:"+retail_price_units);
			
			var wholesale_price			= wholesale_price_units * productformat.wholesale * productformat.quantity;
			var retail_price			= retail_price_units * productformat.retail;
			logger.info("wholesale_price:"+wholesale_price);
			logger.info("retail_price:"+retail_price);
			
			var	price					= ( wholesale_price + retail_price ).toFixed(2);
			logger.info("price:"+price);
			
			return callback(null,price);
		});
	},
		
	get_price_calculation: function(req, res, next) {
		
		logger.info("En GET price calculation");
		var valerrors = validate_shopping_cart_params(req, res, true);
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		var productformatid	= req.query.productformatid;
		var quantity		= req.query.quantity;
		var incart			= req.query.incart;
		
		var controllers = require('./controller');
		controllers.shoppingcart.get_price(req.models, productformatid, quantity, function(err,price) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			
			logger.info("price:"+price);
			logger.info("incart:"+incart);
			
			if(incart=='false') {
				logger.info('Returning price to client');
				return res.status(200).send(price);
			}
			else {
				var ter_token		= req.cookies.ter_token;
				logger.info("Reading user session with token:"+ter_token);
				req.models.userssessions.find({token: ter_token},function(err,usersessions) {
					if(err) {
						return utils.send_ajax_error(req,res,err);
					}
					var usersession		= usersessions[0];
					logger.info("Reading shopping cart");
					req.models.shoppingcart.find({user_session_id:usersession.id, product_format_id: productformatid},function(err,shoppingcart) {
						if(err) {
							return utils.send_ajax_error(req,res,err);
						}
						logger.info("Updating shopping cart:"+JSON.stringify(shoppingcart[0]));
						shoppingcart[0].save({quantity: quantity},function(err) {
							if(err) {
								return utils.send_ajax_error(req,res,err);
							}
							logger.info("Sending price to client");
							return res.status(200).send(price);
						});
					});
				});				
			}
		});
	},
	
	post_product_to_cart: function(req, res, next) {
		logger.info("En POST product format to shopping cart");
		
		var valerrors = validate_shopping_cart_params(req, res, false);
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		var productformatid	= req.body.productformatid;
		var quantity		= req.body.quantity;
		var ter_token		= req.cookies.ter_token;
		
		logger.info("Getting user session");
		req.models.userssessions.find({token: ter_token},function(err,usersessions) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			var usersession		= usersessions[0];
			var shoppingcart	= ld.merge({user_session_id:usersession.id, product_format_id: productformatid,quantity:quantity });
			
			logger.info("Persisting product format on session");
			req.models.shoppingcart.create(shoppingcart,function(err,shoppingcart) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				req.models.shoppingcart.count({user_session_id:usersession.id},function(err,count) {
					if(err) {
						return utils.send_ajax_error(req,res,err);
					}
					return res.status(200).send(''+count);
				});
			});
		});
	},
	
	get_cart_products_count: function(req, res, next) {
		logger.info("GET cart products count");
		var ter_token		= req.cookies.ter_token;
		
		logger.info("Getting user session");
		req.models.userssessions.find({token: ter_token},function(err,usersessions) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			logger.info("Getting user session");
			
			var usersession		= usersessions[0];
			req.models.shoppingcart.count({user_session_id:usersession.id},function(err,count) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				return res.status(200).send(''+count);
			});
		});
	},

	get_shopping_cart: function(req, res, next) {
		logger.info("GET shopping cart");
		var pageinfo	= req.pageinfo;
		var ter_token	= req.cookies.ter_token;
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Getting User Session');
				req.models.userssessions.find({token: ter_token},function(err,usersessions) {
					if(err) {
						return callback(err);
					}
					var usersession		= usersessions[0];
					return callback(err,usersession);
				});
			}, 
			function(usersession,callback) {
				if(pageinfo.is_logged_in===true) {
					logger.info("User is logged in");
					usersession.getUser(function (err, user) {
						if(err) {
							return callback(err);
						}
						logger.info('User logged in:'+user.fullName());
						pageinfo = ld.merge(pageinfo,{
							first_name: user.first_name, 
							last_name: user.last_name, 
							email_address: user.email_address,
							address: user.address || '',
							city: user.city || '',
							telephone: user.telephone || '',
							zipcode: user.zipcode || '',
							state: user.state});
						return callback(err,usersession);
					});
				}
				else {
					logger.info("User is NOT logged in");
					return callback(null,usersession);
				}
			},
			function(usersession,callback) {
				logger.info("Reading shopping cart");
				req.models.shoppingcart.find({user_session_id: usersession.id},function(err,shoppingcart) {
					if(err) {
						return callback(err);
					}
					logger.info("Records readed:"+shoppingcart.length);
					return callback(err,usersession,shoppingcart);
				});
			},
			function(usersession,shoppingcart,callback) {

				var async = require('async');
				var totalcart = 0;
				async.each(shoppingcart, function(cartelement, asynccallback) {
					var modelsutil	= require('../models/modelsutil');
					modelsutil.getCategories(req.db, {useformatid:cartelement.product_format_id,includeunique:false},function(err,category) {
						if(err) {
							return asynccallback(err);
						}
						cartelement = ld.merge(cartelement,{productformat:category[0].products[0].productsformats[0]});
						cartelement = ld.merge(cartelement,{product:category[0].products[0]});
						cartelement = ld.merge(cartelement,{category:category[0]});
						var totalitem = (cartelement.quantity*cartelement.productformat.retail).toFixed(2);
						totalcart = parseFloat(totalcart) + parseFloat(totalitem);
						cartelement = ld.merge(cartelement,{totalitem:totalitem});
						return asynccallback();
					});
				}, function(err) {
					if(err) {
						return callback(err);
					}
					else {
						pageinfo = ld.merge(pageinfo,{totalcart:totalcart.toFixed(2),shoppingcart:shoppingcart,csrfToken: req.csrfToken()});
						return callback();
					}
				});
			},
		], 
		function(err) {
			logger.info("Rendering page");
			if(err) {
				logger.info("Rendering page error:"+err);
				return next(err);
			}
			logger.info("Rendering page with NO ERROR");

			logger.info(JSON.stringify(pageinfo));
			res.render('shopping_cart.html',pageinfo);	
		});
	},
	
	
	delete_product_of_cart: function(req, res, next) {
		logger.info("En DELETE shopping cart");
		
		req.check('shopping_cart_id', 'Id de Shopping Cart es requerido').notEmpty();
		if(req.validationErrors()) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		var shopping_cart_id	= req.body.shopping_cart_id;
		
		logger.info("Getting shopping cart element:"+shopping_cart_id);
		req.models.shoppingcart.get(shopping_cart_id,function(err,shoppingcart) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}

			shoppingcart.remove(function(err,products) {
				if(err) {
					return callback(err);
				}
				logger.info("Category removed successfully");
				return res.status(200).send('OK');
			});
		});
	},
	
	post_execute_purchase: function(req, res, next) {
		logger.info("En POST execute purchase");
		var pageinfo			= req.pageinfo;
		var already_registered	= req.body.already_registered;
		
		req.check('address', 'Dirección es requerida').notEmpty();
		req.check('city', 'Ciudad es requerida').notEmpty();
		req.check('telephone', 'Teléfono es requerido').notEmpty();
		req.check('zipcode', 'Código postal es requerido y numérico').notEmpty().isInt();
		req.check('delivery_type', 'Tipo de delivery es requerido y numérica').notEmpty().isInt();
		req.check('payment_type', 'Forma de Pago es requerida y numérica').notEmpty().isInt();
		req.assert('purchase_conditions', 'Debe marcar que ha leído las Políticas de Privacidad').notEmpty();
		
		var email_address;
		var password;
		var first_name;
		var last_name;
		if(pageinfo.is_logged_in===false) {
			logger.info("User is NOT logged in");
			logger.info("Already registered:"+already_registered);
			if(already_registered==='false') {
				logger.info('Already registered is false');
				req.assert('email_address', 'Email es incorrecto').isEmail();
				req.assert('password', 'Clave es requerida').notEmpty();
				req.assert('first_name', 'Nombre es requerido').notEmpty();
				req.assert('last_name', 'Apellido es requerido').notEmpty();
				
				email_address	= req.body.email_address;
				password		= req.body.password;
				first_name		= req.body.first_name;
				last_name		= req.body.last_name;
			}
			else {
				req.assert('email_address_reg', 'Email es incorrecto').isEmail();
				req.assert('password_reg', 'Clave es requerida').notEmpty();
				email_address	= req.body.email_address_reg;
				password		= req.body.password_reg;
			}
		}
		else {
			logger.info("User is logged in");
			req.assert('first_name_log', 'Nombre es requerido').notEmpty();
			req.assert('last_name_log', 'Apellido es requerido').notEmpty();
			first_name		= req.body.first_name_log;
			last_name		= req.body.last_name_log;
		}
		
		logger.info("Validating fields");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				if(pageinfo.is_logged_in===false) {
					if(already_registered==='false') {
						logger.info('Register new user and purchase');
						var controllers = require('./controller');
						controllers.registration.save_user(req.models, req.usersession, req.constants.CUSTOMER_ID, email_address, password, first_name, last_name, function(err,user) {
							logger.info("Registration error:"+err);
							logger.info("Registration user:"+JSON.stringify(user));
							return callback(err,user);
						});
					}
					else {
						logger.info('Login and purchase');
						var controllers = require('./controller');
						controllers.registration.save_login(req.models, req.usersession, email_address, password, function(err,user) {
							return callback(err,user);
						});
					}
				}
				else {
					logger.info("User is logged in");
					req.usersession.getUser(function (err, user) {
						return callback(err,user);
					});
				}
			}, 
			function(user,callback) {
				logger.info("Reading shopping cart");
				req.models.shoppingcart.find({user_session_id: req.usersession.id},function(err,shoppingcart) {
					if(err) {
						return callback(err);
					}
					logger.info("Records readed:"+shoppingcart.length);
					return callback(err,user,shoppingcart);
				});
			},
			function(user,shoppingcart,callback) {
				logger.info("Saving user info");
				user.address		= req.body.address;
				user.city			= req.body.city;
				user.zipcode		= req.body.zipcode;
				user.state			= req.body.state;
				user.telephone		= req.body.telephone;
				user.save(function(err) {
					return callback(err,user,shoppingcart);
				});
			},
			function(user,shoppingcart,callback) {
				logger.info("Saving transaction header info");
				var transactionheader = {};
				transactionheader.user_id			= user.id;
				transactionheader.purchase_date		= new Date();
				transactionheader.delivery_type		= req.body.delivery_type;
				transactionheader.payment_type		= req.body.payment_type;
				transactionheader.total_purchase	= 0;
				transactionheader.mail_sent			= false;
				
				req.models.transactionsheader.create(transactionheader,function(err,transactionheader) {
					return callback(err,user,shoppingcart,transactionheader);
				});
			},
			function(user,shoppingcart,transactionheader,callback) {
				logger.info("Saving transaction detail info");
				
				var async = require('async');
				async.each(shoppingcart, function(cartelement, asynccallback) {
					
					var transactiondetail = {};
					transactiondetail.transaction_header_id = transactionheader.id;
					transactiondetail.product_format_id		= cartelement.product_format_id;
					transactiondetail.quantity				= cartelement.quantity;
					var controllers = require('./controller');
					controllers.shoppingcart.get_price(req.models, cartelement.product_format_id, cartelement.quantity, function(err,price) {
						if(err) {
							return asynccallback(err);
						}
						transactiondetail.price				= price;
						cartelement.price					= price;
						req.models.transactionsdetail.create(transactiondetail,function(err,transactiondetail) {
							return asynccallback(err);
						});
					});
				}, 
				function(err) {
					logger.info("Calculating total");
					var totalcart = 0;
					logger.info("totalcart:"+totalcart);
					shoppingcart.forEach(function(cartelement) {
						logger.info("Price:"+cartelement.price);
						totalcart = math.add(totalcart,cartelement.price);
					});
					logger.info("Total purchase:"+totalcart);
					transactionheader.total_purchase = totalcart.toFixed(2);
					return callback(err,transactionheader,shoppingcart);
				});
			},
			function(transactionheader,shoppingcart,callback) {
				logger.info("Updating transaction header info ( updating total purchase )");
				transactionheader.save(function(err) {
					return callback(err,shoppingcart);
				});
			},
			function(shoppingcart,callback) {
				logger.info("Deleting element from shopping cart");
				var async = require('async');
				async.each(shoppingcart, function(cartelement, asynccallback) {
					logger.info("Getting shopping cart element to remove");
					cartelement.remove(function(err,element) {
						return asynccallback(err);
					});
				}, 
				function(err) {
					return callback(err);
				});
			}
		], 
		function(err) {
			logger.debug('Finalizacion de compra');
			if(err) {
				logger.debug('Error por enviar al cliente:'+err);
				return utils.send_ajax_error(req,res,err);
			}
			logger.debug('Compra exitoso !');
			return res.status(200).send('OK');
		});
		
		
		
	}
};

