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
					req.logger.info('MEC>1');
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
		
		
		/*
		req.logger.info('En GET products with search:'+req.query.search);
		req.models.products.find({},['description']).where('lower(description) ilike ?',['%'+req.query.search+'%']).run(function(err,products) {
			if(err) {
				return next(err);
			}
			var ld			= require('lodash');
			var pageinfo	= ld.merge(req.sessionstatus, {products:products, csrfToken: req.csrfToken(),search: req.query.search});
			req.logger.info('Getting packaging');
			req.models.packaging.find({},['name'],function(err,packaging) {
				if(err) {
					return next(err);
				}
				ld.merge(pageinfo, {packaging:packaging});
				req.logger.info('Getting categories');
				req.models.categories.find({},['name'],function(err,categories) {
					if(err) {
						return next(err);
					}
					ld.merge(pageinfo, {categories:categories});
					req.logger.info('Rendering page');
					
				});
			});
		});
		*/
	},

	post_products: function(req, res, next) {
		req.logger.info('En POST products');
	},

	put_products: function(req, res, next) {
		req.logger.info('En PUT products');
	},
	
	delete_products: function(req, res, next) {
		req.logger.info('En DELETE products');
	}
};


