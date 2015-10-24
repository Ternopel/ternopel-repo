'use strict';

var ld			= require('lodash'),
	modelsutil	= require('../models/modelsutil');

// Getting information to render main menu
var get_categories_info = function(req, res, next, mycallback) {
	req.logger.info('Reading categories');
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
		var pageinfo	= ld.merge(req.pageinfo);
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
						if(req.params.search) {
							page_to_render='search';
						}
						else {
							page_to_render='offers';
						}
					}
				}
				req.logger.info("We will render:"+page_to_render);
				ld.merge(pageinfo,{page_to_render:page_to_render});
				return callback();
			},
			function(callback) {
				if(pageinfo.page_to_render==='product') {
					req.logger.info('-------------------> Get Product Info');
					
					
					var filters = ld.merge({filter:{url:req.params.product}});
					modelsutil.getProducts(req,res,next,filters,function(err,products) {
						if(err) {
							return callback(err);
						}
						if(products.length===0) {
							return callback('Este producto no está más disponible');
						}
						var detailedproduct = products[0];
						ld.merge(pageinfo,{detailedproduct:detailedproduct});
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
						if(err) {
							return callback(err);
						}
						if(categories.length===0) {
							return callback('Esta categoria no está más disponible');
						}
						var currentcategory = categories[0];
						var filters = ld.merge({filter:{is_visible:true,category_id:currentcategory.id},formatslimit:3});
						modelsutil.getProducts(req,res,next,filters,function(err,products) {
							if(err) {
								return callback(err);
							}
							ld.merge(currentcategory,{products:products});
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
				if(pageinfo.page_to_render==='offers') {
					req.logger.info('-------------------> Get Offers Info');
					var filters = ld.merge({filter:{is_visible:true,is_offer:true},formatslimit:3});
					modelsutil.getProducts(req,res,next,filters,function(err,offersproducts) {
						if(err) {
							return callback(err);
						}
						req.logger.info('Offers found:'+offersproducts.lenght);
						if(req.query.posters) {
							var pageinfo	= ld.merge(req.pageinfo, {offersproducts:offersproducts,csrfToken: req.csrfToken()});
							return callback();
						}
						else {
							modelsutil.getPosters(req,res,next,function(err,posters) {
								if(err) {
									return next(err);
								}
								var pageinfo	= ld.merge(req.pageinfo, {offersproducts:offersproducts, posters:posters, csrfToken: req.csrfToken()});
								return callback();
							});
						}
					});
				}
				else {
					return callback();
				}
			},
			function(callback) {
				if(pageinfo.page_to_render==='search') {
					req.logger.info('-------------------> Get Search Info');
					ld.merge(pageinfo,{searchinput:req.params.search});
					req.logger.info('Search with criteria:'+req.params.search);
					var filters = ld.merge({filter:{is_visible:true},search:req.params.search,formatslimit:3});
					modelsutil.getProducts(req,res,next,filters,function(err,searchproducts) {
						if(err) {
							return callback(err);
						}
						req.logger.info('Search found:'+searchproducts.length);
						ld.merge(pageinfo,{searchproducts:searchproducts});
						return callback();
					});
				}
				else {
					return callback();
				}
			},
			function(callback) {
				req.logger.info('-------------------> Get Left toolbar information');
				get_categories_info(req,res,next,function(err,categories) {
					if(err) {
						return callback(err);
					}
					req.logger.info('Filling left toolback categories');
					ld.merge(pageinfo,{menu_categories:categories});
					
					req.logger.info('Getting offers');
					var filters = ld.merge({filter:{is_visible:true,is_offer:true},formatslimit:1,productslimit:2});
					modelsutil.getProducts(req,res,next,filters,function(err,limitedoffersproducts) {
						if(err) {
							return callback(err);
						}
						ld.merge(pageinfo,{limitedoffersproducts:limitedoffersproducts});
						return callback();
					});
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
