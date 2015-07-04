'use strict';

(function (modelsutil) {

	modelsutil.getCategories = function (req,res,next,getcallback) {
	
		var async		= require('async'),
			ld			= require('lodash');
		
		req.logger.info('Entering to get_reports');
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

})(module.exports);
