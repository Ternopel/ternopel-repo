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
				var currentproduct = ld.merge({id:0, category_id:Number(req.query.categoryid), name:'', is_visible:true, is_offer:false, url:''});
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
				packaging.unshift(ld.merge({id:"", name:"Ingrese packaging"}));
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
				categories.unshift(ld.merge({id:"", name:"Ingrese categoría"}));
				req.logger.info(JSON.stringify(categories));
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

var save_product = function(req, res, next, is_new) {
	
	req.assert('id',			'Id es requerido').notEmpty();
	req.assert('name',			'Nombre es requerido').notEmpty();
	req.assert('url',			'Url es requerido').notEmpty();
	req.assert('category_id',	'Seleccione categoría').notEmpty();
	req.assert('packaging_id',	'Seleccione packaging').notEmpty();

	var valerrors = req.validationErrors();
	if(valerrors) {
		return utils.send_ajax_validation_errors(req,res,valerrors);
	}

	var waterfall = require('async-waterfall');
	waterfall([ 
		function(callback) {
			var filter={or:[{name: req.body.name}, {url: req.body.url}]};
			req.logger.info("Searching using filter:"+JSON.stringify(filter));
			req.models.products.find(filter, function(err,products) {
				if(err) {
					return callback(err);
				}
				if(products.length===1) {
					if(is_new) {
						return callback('El valor asignado al nombre o url existe en otro registro ('+products[0].id+')');
					}
					else if ( Number(products[0].id) !== Number(req.body.id) ) {
						return callback(products[0].id+' '+req.body.id+' El valor asignado al nombre o url existe en otro registro ('+products[0].id+')');
					}
				}
				return callback();
			});
		},
		function(callback) {
			if(is_new) {
				var product = {};
				return callback(null,product);
			}
			else {
				req.logger.info("Getting id:"+req.body.id);
				req.models.products.get(req.body.id,function(err,product) {
					return callback(err,product);
				});
			}
		},
		function(product,callback) {
			ld.merge(product,{name:req.body.name,url:req.body.url,category_id:Number(req.body.category_id),packaging_id:Number(req.body.packaging_id),show_format:true});
			if(req.body.is_visible==='on') {
				ld.merge(product,{is_visible:true});
			}
			else {
				ld.merge(product,{is_visible:false});
			}
			if(req.body.is_offer==='on') {
				ld.merge(product,{is_offer:true});
			}
			else {
				ld.merge(product,{is_offer:false});
			}
			if(is_new) {
				req.logger.info("Creating product:"+JSON.stringify(product));
				req.models.products.create(product,function(err,product) {
					return callback(err,product);
				});
			}
			else {
				req.logger.info("Updating product:"+JSON.stringify(product));
				product.save(function(err) {
					return callback(err,product);
				});
			}
		},
		function(product,callback) {
			var filters = ld.merge({filter:{id:product.id}});
			modelsutil.getProducts(req,res,next,filters,function(err,products) {
				if(err) {
					return callback(err);
				}
				var currentproduct = products[0];
				return callback(null, '/'+currentproduct.category.url + '/' +currentproduct.url);
			});
		}		
	], 
	function(err,url) {
		if(err) {
			return utils.send_ajax_error(req,res,err);
		}
		req.logger.debug('Returning url');
		return res.status(200).send(url);
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
	},
	
	post_edit_product: function(req, res, next) {
		
		req.logger.info("En POST products");
		save_product(req,res,next,false);
		
	},
	
	put_edit_product: function(req, res, next) {

		req.logger.info("En PUT products");
		save_product(req,res,next,true);
		
	}
};


