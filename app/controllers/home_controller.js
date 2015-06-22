var ld = require('lodash');

// Getting information to render main menu
var get_categories_info = function(req, res, next, mycallback) {
	req.logger.info('Reading categories');
	var modelsutil	= require('../models/modelsutil');
	modelsutil.getCategories(req,res,next,function(err,categories) {
		if(err) {
			return mycallback(err);
		}
		var i=0,ilen=0;
		for (i=0,ilen=categories.length;i<ilen;++i) {
			var category = categories[i];
			if(category.url === req.params.category) {
				ld.merge(category,{selected: true});
			}
			else {
				ld.merge(category,{selected: false});
			}
			
			var products = category.products;
			var j=0,jlen=0;
			for (j=0,jlen=products.length;j<jlen;++j) {
				var product = products[j];

				if(product.url === req.params.product) {
					ld.merge(product,{selected: true});
				}
				else {
					ld.merge(product,{selected: false});
				}
			}
		}
		return mycallback(null,categories);
	});
};
		
module.exports = {
	get_home: function(req, res, next) {
		req.logger.info("Home GET");
		var pageinfo	= ld.merge(req.sessionstatus);
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.info('Deciding which subpage we must render');
				var page_to_render='';
				if(req.params.product) {
					page_to_render='product';
				}
				else {
					if(req.params.category) {
						page_to_render='category';
					}
					else {
						page_to_render='sales';
					}
				}
				req.logger.info("We will render:"+page_to_render);
				ld.merge(pageinfo,{page_to_render:page_to_render});
				return callback();
			},
			function(callback) {
				if(pageinfo.page_to_render==='product') {
					req.logger.info('-------------------> Get Product Info');
					req.models.products.find({url: req.params.product},function(err,products) {
						if(products.length===0) {
							return callback('Este producto no está más disponible');
						}
						var currentproduct = products[0];
						ld.merge(pageinfo,{currentproduct:currentproduct});
						return callback();
					});
				}
				else {
					return callback();
				}
			},
			function(callback) {
				if(pageinfo.page_to_render==='category') {
					req.logger.info('-------------------> Get Category Info');
					req.models.categories.find({url: req.params.category},function(err,categories) {
						req.logger.info('MEC>1');
						if(err) {
							req.logger.info('MEC>2');
							return callback(err);
						}
						req.logger.info('MEC>31');

						if(categories.length===0) {
							req.logger.info('MEC>41');

							return callback('Esta categoria no está más disponible');
						}
						req.logger.info('MEC>51');

						var currentcategory = categories[0];
						req.logger.info('MEC>61');

						currentcategory.getProducts(function(err,products) {
							req.logger.info('MEC>71');

							if(err) {
								req.logger.info('MEC>8');

								return callback(err);
							}
							req.logger.info('MEC>91');

							ld.merge(currentcategory,{products:products});
							req.logger.info('MEC>10');

							ld.merge(pageinfo,{currentcategory:currentcategory});
							return callback();
						});
					});
				}
				else {
					return callback();
				}
			
			},
			function(callback) {
				if(pageinfo.page_to_render==='sales') {
					req.logger.info('-------------------> Get Sales Info');
					return callback();
				}
				else {
					return callback();
				}
			},
			function(callback) {
				get_categories_info(req,res,next,function(err,categories) {
					if(err) {
						return callback(err);
					}
					ld.merge(pageinfo,{categories:categories});
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
			res.render('home.html',pageinfo);
		});
	}
};
