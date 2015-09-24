'use strict';

var utils		= require('./utils'),
	ld			= require('lodash'),
	modelsutil	= require('../models/modelsutil'),
	waterfall	= require('async-waterfall');


var get_product = function(req, res, next, is_new) {

	var pageinfo;
	if(is_new) {
		pageinfo = ld.merge(req.pageinfo, {method:'PUT',operation:'Alta',csrfToken: req.csrfToken()});
	}
	else {
		pageinfo = ld.merge(req.pageinfo, {method:'POST',operation:'Edición',csrfToken: req.csrfToken()});
	}
	
	waterfall([ 
		function(callback) {
			if(is_new) {
				var currentproduct = ld.merge({category_id:Number(req.query.categoryid), name:'', is_visible:true, is_offer:false, url:''});
				
				req.logger.info('=================================================================');
				req.logger.info(JSON.stringify(currentproduct));
				req.logger.info('=================================================================');
				
				ld.merge(pageinfo, {currentproduct:currentproduct});
				return callback();
			}
			else {
				var filters = ld.merge({filter:{id:req.query.productid}});
				modelsutil.getProducts(req,res,next,filters,function(err,products) {
					if(err) {
						return callback(err);
					}
					
					if(products.length!==1) {
						return callback('Producto con id:'+req.query.productid+' no existente');
					}
					var currentproduct = products[0];
					ld.merge(pageinfo, {currentproduct:currentproduct});
					return callback();
				});
			}
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
		res.render('admin_new_product.html',pageinfo);
	});
	
};




module.exports = {
	get_add_product: function(req, res, next) {

		if(typeof req.query.categoryid === 'undefined') {
			return next('No se encontró categoría del Producto');
		}

		get_product(req,res,next,true);
	},

	get_edit_product: function(req, res, next) {
		
		if(typeof req.query.productid === 'undefined') {
			return next('No se encontró Id del Producto');
		}
		
		get_product(req,res,next,false);
	}
};


