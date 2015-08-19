'use strict';

(function (modelsutil) {

	modelsutil.getCategories = function (req,res,next,getcallback) {
	
		var async		= require('async'),
			ld			= require('lodash');
		
		req.logger.info('Entering to get_categories');
		req.models.categories.find({},['name'],function(err,categories) {
			if(err) {
				return next(err);
			}
			req.logger.debug('Categories readed:'+categories.length);
			async.each(categories, function(category, callback) {
				category.getProducts().order('description').run(function(err,products) {
					if(err) {
						return callback(err);
					}
					req.logger.debug("Category:"+category.name+" Products readed:"+products.length);
					ld.merge(category, {products:products});
					return callback();
				});
			}, function(err) {
				if(err) {
					getcallback(err);
				}
				else {
					return getcallback(null,categories);
				}
			});
		});
	};

	modelsutil.getProducts = function (req,res,next,category,getcallback) {
		
		var async		= require('async'),
		ld			= require('lodash');
		
		req.logger.info('Entering to get_products');
		req.models.products.find({category_id:category.id},['description'],function(err,products) {
			if(err) {
				return next(err);
			}
			req.logger.debug('Products readed:'+products.length);
			async.each(products, function(product, callback) {
				product.getProductsFormats().run(function(err,productformats) {
					if(err) {
						return callback(err);
					}
					req.logger.debug("Product:"+product.description+" Formats readed:"+productformats.length);
					ld.merge(product, {productformats:productformats});
					return callback();
				});
			}, function(err) {
				if(err) {
					getcallback(err);
				}
				else {
					return getcallback(null,products);
				}
			});
		});
	};
	
})(module.exports);
