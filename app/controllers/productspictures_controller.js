'use strict';

var utils		= require('./utils'),
	ld			= require('lodash'),
	modelsutil	= require('../models/modelsutil'),
	fs			= require('fs'),
	logger		= require("../../utils/logger")(module);

module.exports = {
	post_productspictures: function(req, res, next) {
		logger.info("En POST products pictures");

		req.assert('product_id', 'El producto es requerido').notEmpty();
		req.assert('picture_id', 'La imagen es requerido').notEmpty();
		req.assert('type', 'El Tipo es requerido').notEmpty();
		req.assert('data', 'El Dato es requerido').notEmpty();
		
		logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}		
		
		var product_id	= req.body.product_id;
		var picture_id	= req.body.picture_id;
//		var type		= req.body.type;
		var type		= 'image/jpeg';
		var data		= req.body.data;
		
		logger.info("Product Id:"+product_id);
		logger.info("Picture Id:"+picture_id);
		logger.info("type:"+type);
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.models.productspictures.get(picture_id,function(err,productpicture) {
					// Not found !
					if(err) {
						return callback(null,null);
					}
					return callback(null,productpicture);
				});
			},
			function(productpicture,callback) {
				if(productpicture) {
					productpicture.content_type	= type;
					productpicture.last_update	= new Date();
					
					logger.info('Updating product picture');
					productpicture.save(function(err) {
						return callback(err,productpicture);
					});
				}
				else {
					logger.info('Creating product picture');
					req.models.productspictures.create({product_id:	product_id,last_update:	new Date(),content_type: type}, function(err,productpicture) {
						return callback(err,productpicture);
					});
				}
			},
			function(productpicture, callback) {
				
				
				var token		= require('node-uuid').v1();
				var tempfile	= '/tmp/temp-image-'+token+'.png'
				var picture_name=req.config.app_products_imgs_dir+"/"+productpicture.id;
				
				logger.info('Writing temporary file:'+tempfile);
				fs.writeFile(tempfile, data,'base64',function (err) {
					if(err) {
						return callback(err);
					}

					logger.info('Converting file :'+tempfile);
					require('lwip').open(tempfile, function(err, image){
						if(err) {
							return callback(err);
						}
						
						logger.info('Generating jpg');
						image.toBuffer('jpg', function(err, data){
							if(err) {
								return callback(err);
							}
							
							logger.info('Saving file '+picture_name);
							fs.writeFile(picture_name+'.jpg', data,'base64',function (err) {
								return callback(err,productpicture);
							});
						});
					});
					
				});
			},
			function(productpicture,callback) {
				var filters = ld.merge({filter:{id:productpicture.product_id}});
				modelsutil.getProducts(req.models, filters,function(err,products) {
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
			logger.debug('Returning url');
			return res.status(200).send(url);
		});	
	},
	
	get_productspictures: function(req, res, next) {
		logger.info("En GET products pictures");
		var picture_id			= req.params.id;
		var id					= picture_id.replace('.jpg','');
		
		logger.info("Getting product info");
		req.models.productspictures.get(id,function(err,productpicture) {

			var picture_name;
			var content_type;
			if(err) {
				picture_name='./public/images/default-img.jpg';
				content_type='image/jpeg';
			}	
			else {
				picture_name=req.config.app_products_imgs_dir+"/"+productpicture.id+".jpg";
				content_type=productpicture.content_type;
			}
			
			logger.info("Reading image "+picture_name);
			fs.readFile(picture_name, function (err, data) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				logger.info("Preparing picture metadata");
				res.setHeader('Content-Type', content_type);
				res.setHeader('Type', 'image');
				res.setHeader('Content-Length', data.length);
				res.setHeader('Content-Disposition', 'inline; filename='+picture_id);
				logger.info("Sending picture to browser");
				return res.send(data);
			});
		});
	}	
	
};
