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
				category.is_visible	= false;
				category.getProducts().order('name').run(function(err,products) {
					if(err) {
						return callback(err);
					}
					if(products.length>0) {
						category.is_visible	= true;
					}
					req.logger.debug("Category:"+category.name+" "+category.is_visible+" Products readed:"+products.length);
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

	modelsutil.getProducts = function (req,res,next,filters,getcallback) {
		
		var async		= require('async'),
			ld			= require('lodash');
		
		req.logger.info('Entering to get_products');
		var productsfind	= req.models.products.find(filters.filter,['name']);
		if(filters.search) {
			productsfind.where('lower(name) ilike ?',['%'+filters.search+'%']);
		}
		if(filters.productslimit) {
			productsfind.limit(filters.productslimit);
		}
		productsfind.run(function(err,products) {
			if(err) {
				return next(err);
			}
			req.logger.debug('Products readed:'+products.length);
			async.each(products, function(product, callback) {
				var productsformatsfind = product.getProductsFormats().order('retail');
				if(filters.formatslimit) {
					productsformatsfind.limit(filters.formatslimit);
				}
				productsformatsfind.run(function(err,productformats) {
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
					req.logger.debug("Product:"+product.name+" Formats readed:"+productformats.length);
					ld.merge(product, {productformats:productformats});
					product.getCategory(function(err,category) {
						if(err) {
							return callback(err);
						}
						req.logger.debug("Product:"+product.name+" Category:"+category.name);
						ld.merge(product, {category:category});
						return callback();
					});
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
	
	
	modelsutil.getPosters = function (req,res,next,getcallback) {

		req.models.posters.find({},['position'],function(err,posters) {
			if(err) {
				return getcallback(err);
			}
			posters.forEach(function(poster) {
				if(poster.category_id) {
					poster.origin	= 'Categoría:'+poster.category.name;
					poster.url		= poster.category.url;
				}
				else {
					poster.origin	= 'Producto:'+poster.product.name;
					poster.url		= poster.product.url;
				}
			});
			return getcallback(null,posters);
		});
	};
	
	
})(module.exports);
