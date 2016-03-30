'use strict';

var utils		= require('./utils'),
	ld			= require('lodash'),
	modelsutil	= require('../models/modelsutil'),
	fs			= require('fs');

module.exports = {
	post_productspictures: function(req, res, next) {
		req.logger.info("En POST products pictures");
		var product_id	= req.body.product_id;
		var type		= req.body.type;
		var data		= req.body.data;
		
		req.logger.info("Id:"+product_id);
		req.logger.info("type:"+type);
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.models.productspictures.find({product_id:product_id},function(err,productspictures) {
					// Not found !
					if(err) {
						return callback(err);
					}
					if(productspictures.length===1) {
						return callback(null,productspictures[0]);
					}
					else {
						return callback(null,null);
					}
				});
			},
			function(productpicture,callback) {
				if(productpicture) {
					productpicture.content_type	= type;
					productpicture.last_update	= new Date();
					
					req.logger.info('Updating product picture');
					productpicture.save(function(err) {
						return callback(err,productpicture);
					});
				}
				else {
					req.logger.info('Creating product picture');
					req.models.productspictures.create({product_id:	product_id,last_update:	new Date(),content_type: type}, function(err,productpicture) {
						return callback(err,productpicture);
					});
				}
			},
			function(productpicture, callback) {
				var picture_name=req.config.app_products_imgs_dir+"/"+productpicture.id;
				req.logger.info('Writing picture:'+picture_name);
				fs.writeFile(picture_name, data,'base64',function (err) {
					return callback(err,productpicture);
				});
			},
			function(productpicture,callback) {
				var filters = ld.merge({filter:{id:productpicture.product_id}});
				modelsutil.getProducts(req.logger, req.models, filters,function(err,products) {
					if(err) {
						return callback(err);
					}
					var currentproduct = products[0];
					return callback(null, '/'+currentproduct.category.url + '/' +currentproduct.url);
				});
			}		
		], 
		function(err,url) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			req.logger.debug('Returning url');
			return res.status(200).send(url);
		});	
	},
	get_productspictures: function(req, res, next) {
		req.logger.info("En GET products pictures");
		var product_id			= req.params.id;
		
		req.logger.info("Getting product info");
		req.models.productspictures.find({product_id:product_id},function(err,productspictures) {
			
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}			

			var picture_name;
			var content_type;
			if(productspictures.length===0) {
				picture_name='./public/images/default-img.jpg';
				content_type='image/jpeg';
			}	
			else {
				var productpicture = productspictures[0];
				picture_name=req.config.app_products_imgs_dir+"/"+productpicture.id;
				content_type=productpicture.content_type;
			}
			
			req.logger.info("Reading image "+picture_name);
			fs.readFile(picture_name, function (err, data) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				req.logger.info("Preparing picture metadata");
				res.setHeader('Content-Type', content_type);
				res.setHeader('Content-Length', data.length);
				res.setHeader('Content-Disposition', 'inline; filename='+product_id);
				
				req.logger.info("Sending picture to browser");
				return res.send(data);
			});
		});
	}
};
