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
				
				req.logger.info("===================================================================");
				req.logger.info(JSON.stringify(product));
				req.logger.info("===================================================================");
				
				
				product.getProductsFormats().order('retail').limit(3).run(function(err,productformats) {
					if(err) {
						return callback(err);
					}
					productformats.forEach(function(productformat) {
						var retaildescription		= '';
						var wholesaledescription	= '';
						if(productformat.quantity===1) {
							retaildescription += product.packaging.name;
						}
						else {
							retaildescription += productformat.quantity + product.packaging.name + 's';
						}
						retaildescription		+= ' de ' + productformat.format + ' a ';
						wholesaledescription	+= productformat.units + ' ' + product.packaging.name + 's a ';
						
						productformat.retaildescription		= retaildescription;
						productformat.wholesaledescription	= wholesaledescription;
					});
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
