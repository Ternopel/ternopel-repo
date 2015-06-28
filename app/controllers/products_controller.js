var utils	= require('./utils');

module.exports = {
	get_products: function(req, res, next) {

		var ld			= require('lodash');
		var pageinfo	= ld.merge(req.sessionstatus, {csrfToken: req.csrfToken(),search: req.query.search});
		var waterfall	= require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.info('Reading products');
				req.models.products.find({},['description']).where('lower(description) ilike ?',['%'+req.query.search+'%']).run(function(err,products) {
					if(err) {
						return callback(err);
					}
					req.logger.info('Iterating products');
					var async = require('async');
					async.each(products, function(product, asynccallback) {
						req.logger.info('Product Info'+JSON.stringify(product));
						product.getProductsFormats().order('format').run(function(err,productsformats) {
							if(err) {
								return asynccallback(err);
							}
							req.logger.debug('Product:'+product.description+' Products Formats readed:'+productsformats.length);
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
						req.logger.error('Error:'+err);
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
						req.logger.error('Error:'+err);
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
				req.logger.info("Rendering page error:"+err);
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
				var filter;
				if(colname==='description') {
					filter={ description:colvalue };
				}
				if(colname==='url') {
					filter={ url:colvalue };
				}
				if(!filter) {
					req.logger.info("Searching using filter:"+JSON.stringify(filter));
					req.models.products.find(filter, function(err,products) {
						if(err) {
							return callback(err);
						}
						if(products.length===1 && products[0].id != id) {
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
				if(colname==='description') {
					product.description	= colvalue;
				}
				if(colname==='url') {
					product.url	= colvalue;
				}
				if(colname==='packaging_id') {
					product.packaging_id	= colvalue;
				}
				if(colname==='category_id') {
					product.category_id	= colvalue;
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
	},
	
	delete_products: function(req, res, next) {
		req.logger.info('En DELETE products');
	}
};


