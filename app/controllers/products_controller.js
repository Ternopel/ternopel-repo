'use strict';

var utils	= require('./utils'),
	fs		= require('fs'),
	logger	= require("../../utils/logger")(module);

module.exports = {
	get_products: function(req, res, next) {
		if(typeof req.query.search === 'undefined') {
			return next('No se encontró parámetro de búsqueda');
		}
		var ld			= require('lodash');
		var pageinfo	= ld.merge(req.pageinfo, {csrfToken: req.csrfToken(),search: req.query.search});
		var waterfall	= require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Reading products');
				req.models.products.find({},['name']).where('lower(name) ilike ?',['%'+req.query.search+'%']).run(function(err,products) {
					if(err) {
						return callback(err);
					}
					logger.info('Products readed:'+products.length);
					var async = require('async');
					async.each(products, function(product, asynccallback) {
						logger.info('Product Info'+JSON.stringify(product));
						product.getProductsFormats().order('format').run(function(err,productsformats) {
							if(err) {
								return asynccallback(err);
							}
							logger.debug('Product:'+product.name+' Products Formats readed:'+productsformats.length);
							ld.merge(product, {productsformats:productsformats});
							return asynccallback();
						});
					}, function(err) {
						if(err) {
							return callback(err);
						}
						else {
							logger.debug('Products'+JSON.stringify(products));
							ld.merge(pageinfo, {products:products});
							return callback();
						}
					});
				});
			},
			function(callback) {
				logger.info('Reading packaging');
				req.models.packaging.find({},['name'],function(err,packaging) {
					if(err) {
						return callback(err);
					}
					logger.debug('Packaging readed:'+packaging.length);
					ld.merge(pageinfo, {packaging:packaging});
					return callback();
				});
			},
			function(callback) {
				logger.info('Reading categories');
				req.models.categories.find({},['name'],function(err,categories) {
					if(err) {
						return callback(err);
					}
					logger.debug('Categories readed:'+categories.length);
					ld.merge(pageinfo, {categories:categories});
					return callback();
				});
			}
		], 
		function(err) {
			logger.info("Rendering page");
			if(err) {
				return next(err);
			}
			logger.info("Rendering page with NO ERROR");
			res.render('admin_products.html',pageinfo);
		});
	},

	post_products: function(req, res, next) {

		logger.info("En POST products");
		
		var id			= req.body.id;
		var colname		= req.body.colname;
		var colvalue	= req.body.colvalue;
		req.assert('colvalue',		'El valor es requerido').notEmpty();

		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}

		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				var filter='';
				if(colname==='name') {
					filter={ name:colvalue };
				}
				if(colname==='url') {
					filter={ url:colvalue };
				}
				if(filter!=='') {
					logger.info("Searching using filter:"+JSON.stringify(filter));
					req.models.products.find(filter, function(err,products) {
						if(err) {
							return callback(err);
						}
						if(products.length===1 && products[0].id !== id) {
							return callback('El valor asignado a la columna existe en otro registro ('+products[0].id+')');
						}
						return callback();
					});
				}
				else {
					return callback();
				}
			},
			function(callback) {
				logger.info("Getting id:"+id);
				req.models.products.get(id,function(err,product) {
					return callback(err,product);
				});
			},
			function(product,callback) {
				if(colname==='name') {
					product.name	= colvalue;
				}
				if(colname==='url') {
					product.url	= colvalue;
				}
				if(colname==='packaging_id') {
					product.packaging_id = colvalue;
				}
				if(colname==='category_id') {
					product.category_id	= colvalue;
				}
				if(colname==='show_format') {
					product.show_format	= colvalue;
				}
				if(colname==='is_visible') {
					product.is_visible	= colvalue;
				}
				if(colname==='is_offer') {
					product.is_offer	= colvalue;
				}
				
				logger.info("Updating product:"+JSON.stringify(product));
				product.save(function(err) {
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

	delete_products: function(req, res, next) {
		logger.info('En DELETE products');
		
		var id			= req.body.id;
		logger.debug("Starting product deletion with id:"+id);
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info("Getting product");
				req.models.products.get(id, function(err,product) {
					if(err) {
						return callback(err);
					}
					logger.debug("Product:"+JSON.stringify(product));
					return callback(null,product);
				});
			},
			function(product,callback) {
				logger.info("Getting products formats");
				product.getProductsFormats(function(err,productsformats) {
					if(err) {
						return callback(err);
					}
					logger.info("Products formats quantity:"+productsformats.length);
					if(productsformats.length>0) {
						return callback('Este producto tiene '+productsformats.length+' formatos asociados. Borre primero los formatos');
					}
					return callback(null,product);
				});
			},
			function(product,callback) {
				logger.info("Getting product to remove");
				product.remove(function(err,productsformats) {
					if(err) {
						return callback(err);
					}
					logger.info("Category removed successfully");
					return callback();
				});
			}
		], 
		function(err) {
			if(err) {
				logger.info("En function error de waterfall:"+err);
				return utils.send_ajax_error(req,res,err);
			}
			logger.debug('Returning success');
			return res.status(200).send('success');
		});
	},
	
	get_productspictures: function(req, res, next) {
		logger.info("En GET products pictures");
		var product_id			= req.params.id;
		var id					= product_id.replace('.jpg','');
		
		logger.info("Getting product info");
		req.models.productspictures.find({product_id:id},['id'],function(err,productspictures) {
			
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
				res.setHeader('Content-Length', data.length);
				res.setHeader('Type', 'image');
				res.setHeader('Content-Disposition', 'inline; filename='+product_id);
//				res.setHeader('Cache-Control', 'max-age=16070400,public');
//				res.setHeader('Expires', 'Mon, 03 Nov 2050 23:16:20 GMT');
//				res.setHeader('Last-Modified', productpicture.last_update.toUTCString());
				
				logger.info("Sending picture to browser");
				return res.send(data);
			});
		});
	}
	
	
};


