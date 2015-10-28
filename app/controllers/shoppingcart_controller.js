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
	}
};

