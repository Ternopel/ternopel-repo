'use strict';

var utils		= require('./utils'),
	ld			= require('lodash'),
	modelsutil	= require('../models/modelsutil'),
	logger		= require("../../utils/logger")(module);

module.exports = {
	post_productsformats: function(req, res, next) {

		logger.info("En POST products formats");
		
		var id			= req.body.id;
		var colname		= req.body.colname;
		var colvalue	= req.body.colvalue;
		req.assert('colvalue',		'El valor es requerido').notEmpty();
		if(	colname==='retail' || colname==='wholesale' || colname==='quantity' || colname==='units' ) {
			req.assert('colvalue', 'Formato inválido').isFloat();
		}

		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info("Getting id:"+id);
				req.models.productsformats.get(id,function(err,productformat) {
					return callback(err,productformat);
				});
			},
			function(productformat,callback) {
				if(colname==='format') {
					productformat.format	= colvalue;
				}
				if(colname==='units') {
					productformat.units	= colvalue;
				}
				if(colname==='quantity') {
					productformat.quantity	= colvalue;
				}
				if(colname==='retail') {
					productformat.retail	= colvalue;
				}
				if(colname==='wholesale') {
					productformat.wholesale	= colvalue;
				}
				
				logger.info("Updating product format:"+JSON.stringify(productformat));
				productformat.save(function(err) {
					return callback(err);
				});
			}
		], 
		function(err) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			logger.debug('Returning success');
			return res.status(200).send('success');
		});
	},
	
	put_productsformats: function(req, res, next) {
		logger.info('En PUT products formats');
		var milli		= new Date().getTime();
		var product_id	= req.body.product_id;
		
		req.assert('product_id', 'El producto es requerido').notEmpty();
		logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		
		logger.info('Creating product format');
		req.models.productsformats.create({	format:			''+milli,
											product_id:		product_id,
											quantity:		1,
											units:			1,
											retail:			0,
											wholesale:		0},function(err,productformat) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			logger.debug("Sending product format to browser:"+JSON.stringify(productformat));
			return res.status(200).send(productformat);
		});
	},
	
	
	get_productsformats: function(req, res, next) {
		logger.info('En GET products formats');
		var milli		= new Date().getTime();
		var product_id	= req.query.product_id;
		
		req.assert('product_id', 'El producto es requerido').notEmpty();
		logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}

		logger.info("Getting product "+product_id);
		var filters = ld.merge({filter:{id:product_id}});
		modelsutil.getProducts(req.models, filters,function(err,products) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			if(products.length===0) {
				return utils.send_ajax_error(req,res,'Este producto no está más disponible');
			}
			var detailedproduct = products[0];
			return res.status(200).send("/"+detailedproduct.category.url+"/"+detailedproduct.url);
		});
	},
	
	
	delete_productsformats: function(req, res, next) {
		logger.info('En DELETE products formats');
		
		var id			= req.body.id;
		logger.debug("Starting product format deletion with id:"+id);
		
		req.models.productsformats.get(id, function(err,productformat) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			
			productformat.remove(function (err) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				logger.debug("Product:"+JSON.stringify(productformat));
				return res.status(200).send('success');
			});
		});
	}
};


