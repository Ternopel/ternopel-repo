'use strict';

var utils	= require('./utils');

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
				req.logger.info('Reading products');
				req.models.products.find({},['name']).where('lower(name) ilike ?',['%'+req.query.search+'%']).run(function(err,products) {
					if(err) {
						return callback(err);
					}
					req.logger.info('Products readed:'+products.length);
					var async = require('async');
					async.each(products, function(product, asynccallback) {
						req.logger.info('Product Info'+JSON.stringify(product));
						product.getProductsFormats().order('format').run(function(err,productsformats) {
							if(err) {
								return asynccallback(err);
							}
							req.logger.debug('Product:'+product.name+' Products Formats readed:'+productsformats.length);
							ld.merge(product, {productsformats:productsformats});
							return asynccallback();
						});
					}, function(err) {
						if(err) {
							return callback(err);
						}
						else {
							req.logger.debug('Products'+JSON.stringify(products));
							ld.merge(pageinfo, {products:products});
							return callback();
						}
					});
				});
			},
			function(callback) {
				req.logger.info('Reading packaging');
				req.models.packaging.find({},['name'],function(err,packaging) {
					if(err) {
						return callback(err);
					}
					req.logger.debug('Packaging readed:'+packaging.length);
					ld.merge(pageinfo, {packaging:packaging});
					return callback();
				});
			},
			function(callback) {
				req.logger.info('Reading categories');
				req.models.categories.find({},['name'],function(err,categories) {
					if(err) {
						return callback(err);
					}
					req.logger.debug('Categories readed:'+categories.length);
					ld.merge(pageinfo, {categories:categories});
					return callback();
				});
			}
		], 
		function(err) {
			req.logger.info("Rendering page");
			if(err) {
				return next(err);
			}
			req.logger.info("Rendering page with NO ERROR");
			res.render('admin_products.html',pageinfo);
		});
	},

	post_products: function(req, res, next) {

		req.logger.info("En POST products");
		
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
					req.logger.info("Searching using filter:"+JSON.stringify(filter));
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
				req.logger.info("Getting id:"+id);
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
				
				req.logger.info("Updating product:"+JSON.stringify(product));
				product.save(function(err) {
					return callback(err);
				});
			}
		], 
		function(err) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			req.logger.debug('Returning success');
			return res.status(200).send('success');
		});
	},

	put_products: function(req, res, next) {
		req.logger.info('En PUT products');
		var milli=new Date().getTime();
		req.logger.info('Creating product');
		req.models.products.create({	name:			'A Insert Product Text here '+milli,
										url:			'A Insert Product url here'+milli,
										show_format:	false,
										is_visible:		false,
										is_offer:		false,
										category_id:	1,
										packaging_id:	1},function(err,product) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			req.logger.debug("Sending product to browser:"+JSON.stringify(product));
			return res.status(200).send(product);
		});
	},
	
	delete_products: function(req, res, next) {
		req.logger.info('En DELETE products');
		
		var id			= req.body.id;
		req.logger.debug("Starting product deletion with id:"+id);
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.info("Getting product");
				req.models.products.get(id, function(err,product) {
					if(err) {
						return callback(err);
					}
					req.logger.debug("Product:"+JSON.stringify(product));
					return callback(null,product);
				});
			},
			function(product,callback) {
				req.logger.info("Getting products formats");
				product.getProductsFormats(function(err,productsformats) {
					if(err) {
						return callback(err);
					}
					req.logger.info("Products formats quantity:"+productsformats.length);
					if(productsformats.length>0) {
						return callback('Este producto tiene '+productsformats.length+' formatos asociados. Borre primero los formatos');
					}
					return callback(null,product);
				});
			},
			function(product,callback) {
				req.logger.info("Getting product to remove");
				product.remove(function(err,productsformats) {
					if(err) {
						return callback(err);
					}
					req.logger.info("Category removed successfully");
					return callback();
				});
			}
		], 
		function(err) {
			req.logger.info("En function error de waterfall:"+err);
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			req.logger.debug('Returning success');
			return res.status(200).send('success');
		});
	}
};


