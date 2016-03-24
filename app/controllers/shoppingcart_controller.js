'use strict';

var cipher	= require('../../utils/cipher'),
	utils	= require('./utils'),
	ld		= require('lodash');


var validate_shopping_cart_params = function(req, res) {
	
	req.check('productformatid', 'Id de Formato de Producto es requerido').notEmpty();
	req.check('quantity', 'Cantidad es requerida y numérica').notEmpty().isInt();
	
	req.logger.info("Validating fields");
	return req.validationErrors();
};

module.exports = {
	get_price_calculation: function(req, res, next) {
		
		req.logger.info("En GET price calculation");
		var valerrors = validate_shopping_cart_params(req, res);
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		var productformatid	= req.query.productformatid;
		var quantity		= req.query.quantity;
		
		req.logger.info("Calculating price");
		req.models.productsformats.get(productformatid,function(err,productformat) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			var wholesale_price_units	= parseInt(quantity / productformat.quantity);
			var retail_price_units		= quantity - ( wholesale_price_units * productformat.quantity);
			req.logger.info("wholesale_price_units:"+wholesale_price_units);
			req.logger.info("retail_price_units:"+retail_price_units);
			
			var wholesale_price			= wholesale_price_units * productformat.wholesale * productformat.quantity;
			var retail_price			= retail_price_units * productformat.retail;
			req.logger.info("wholesale_price:"+wholesale_price);
			req.logger.info("retail_price:"+retail_price);
			
			var	price					= ( wholesale_price + retail_price ).toFixed(2);
			req.logger.info("price:"+price);
			
			return res.status(200).send(price);
		});
	},
	
	post_product_to_cart: function(req, res, next) {
		req.logger.info("En POST product format to shopping cart");
		
		var valerrors = validate_shopping_cart_params(req, res);
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		var productformatid	= req.body.productformatid;
		var quantity		= req.body.quantity;
		var ter_token		= req.cookies.ter_token;
		
		req.logger.info("Getting user session");
		req.models.userssessions.find({token: ter_token},function(err,usersessions) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			var usersession		= usersessions[0];
			var shoppingcart	= ld.merge({user_session_id:usersession.id, product_format_id: productformatid,quantity:quantity });
			
			req.logger.info("Persisting product format on session");
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
		req.logger.info("GET cart products count");
		var ter_token		= req.cookies.ter_token;
		
		req.logger.info("Getting user session");
		req.models.userssessions.find({token: ter_token},function(err,usersessions) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			req.logger.info("Getting user session");
			
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
		req.logger.info("GET shopping cart");
		var pageinfo	= req.pageinfo;
		var ter_token	= req.cookies.ter_token;
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.info('Getting User Session');
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
					req.logger.info("User is logged in");
					usersession.getUser(function (err, user) {
						if(err) {
							return callback(err);
						}
						req.logger.info('User logged in:'+user.fullName());
						pageinfo = ld.merge(pageinfo,{first_name: user.first_name, last_name: user.last_name, email_address: user.email_address});
						return callback(err,usersession);
					});
				}
				else {
					req.logger.info("User is NOT logged in");
					return callback(null,usersession);
				}
			},
			function(usersession,callback) {
				req.logger.info("Reading shopping cart");
				req.models.shoppingcart.find({user_session_id: usersession.id},function(err,shoppingcart) {
					if(err) {
						return callback(err);
					}
					req.logger.info("Records readed:"+shoppingcart.length);
					return callback(err,usersession,shoppingcart);
				});
			},
			function(usersession,shoppingcart,callback) {

				var async = require('async');
				var totalcart = 0;
				async.each(shoppingcart, function(cartelement, asynccallback) {
					var modelsutil	= require('../models/modelsutil');
					modelsutil.getCategories(req,res,next,{useformatid:cartelement.product_format_id,includeunique:false},function(err,category) {
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
						pageinfo = ld.merge(pageinfo,{totalcart:totalcart.toFixed(2)});
						pageinfo = ld.merge(pageinfo,{shoppingcart:shoppingcart});
						return callback();
					}
				});
			},
		], 
		function(err) {
			req.logger.info("Rendering page");
			if(err) {
				req.logger.info("Rendering page error:"+err);
				return next(err);
			}
			req.logger.info("Rendering page with NO ERROR");

			
			res.render('shopping_cart.html',pageinfo);	
		});
	}
};

