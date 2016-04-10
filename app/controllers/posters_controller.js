'use strict';

var utils		= require('./utils'),
	fs			= require('fs'),
	ld			= require('lodash'),
	modelsutil	= require('../models/modelsutil'),
	logger		= require("../../utils/logger")(module);

module.exports = {
		
	get_add_page: function(req, res, next) {
		logger.info('En GET ADD PAGE');
		var poster		= ld.merge({position:''});
		var pageinfo	= ld.merge(req.pageinfo, {method:'PUT',csrfToken: req.csrfToken(),poster:poster});

		modelsutil.getCategories(req.db, {includeunique:true},function(err,categories) {
			if(err) {
				return next(err);
			}
			ld.merge(pageinfo, {categories:categories});
			logger.debug('Categories readed:'+categories.length);
			req.models.products.find({is_visible:true},['name'],function(err,products) {
				if(err) {
					return next(err);
				}
				logger.debug('Products readed:'+products.length);
				ld.merge(pageinfo, {products:products});
				res.render('form_poster.html',pageinfo);
			});
		});
	},		

	get_posters: function(req, res, next) {
		logger.info('En GET posters');
		modelsutil.getPosters(req.models, function(err,posters) {
			if(err) {
				return next(err);
			}
			var pageinfo	= ld.merge(req.pageinfo, {posters:posters, csrfToken: req.csrfToken()});
			res.render('admin_posters.html',pageinfo);
		});
	},

	put_posters: function(req, res, next) {
		
		logger.info('En PUT posters');
		logger.debug("Defining validators");
		req.assert('is_product', 'El flag indicando tipo de poster es requerido').notEmpty();
		req.assert('position', 'El orden del cartel es requerido').notEmpty();
		req.assert('type', 'Por favor, cargue el archivo').notEmpty();
		req.assert('data', 'El stream del archivo es requerido').notEmpty();
		var category_id;
		var product_id;
		if(req.body.is_product) {
			if(req.body.is_product==='true') {
				category_id	= req.body.product_id.split('_')[0];
				product_id	= req.body.product_id.split('_')[1];
				req.assert('product_id', 'El código de producto es requerido').notEmpty();
			}
			else {
				category_id	= req.body.category_id;
				req.assert('category_id', 'El código de categoría es requerido').notEmpty();
			}
		}
	
		logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		
		logger.info("Searching for existing position");
		req.models.posters.find({position:req.body.position}, function(err,posters) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			if( posters.length===1 ) {
				return utils.send_ajax_error(req,res,'El valor asignado al orden existe en otro cartel ('+posters[0].id+')');
			}
			
			logger.info('Creating poster');
			req.models.posters.create({	category_id:category_id,
										product_id:product_id,
										content_type:req.body.type,
										last_update:new Date(),
										position:req.body.position},function(err,poster) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				var token		= require('node-uuid').v1();
				var picture_name= req.config.app_posters_imgs_dir+"/"+poster.id;
				var tempfile	= '/tmp/temp-image-'+token+'.png'
				
				logger.info('Writing temporary file:'+tempfile);
				fs.writeFile(tempfile, req.body.data,'base64',function (err) {
					if(err) {
						return utils.send_ajax_error(req,res,err);
					}
					
					
					logger.info('Converting file :'+tempfile);
					require('lwip').open(tempfile, function(err, image){
						if(err) {
							return callback(err);
						}
						
						logger.info('Generating jpg');
						image.toBuffer('jpg', function(err, data){
							if(err) {
								return callback(err);
							}
							
							logger.info('Saving file '+picture_name);
							fs.writeFile(picture_name+'.jpg', data,'base64',function (err) {
								logger.debug("Sending response to browser");
								return res.status(200).send('created');
							});
						});
					});					
				});
			});
		});	
	},
	
	get_picture: function(req, res, next) {
		logger.info("En GET poster pictures 222");
		var id			= req.params.id;
		
		logger.info("Getting poster info");
		req.models.posters.get(id.replace('.jpg',''),function(err,poster) {
			
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			
			var picture_name=req.config.app_posters_imgs_dir+"/"+id;
			var content_type=poster.content_type;
			
			logger.info("Reading image "+picture_name);
			fs.readFile(picture_name, function (err, data) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				logger.info("Preparing picture metadata");
				res.setHeader('Content-Type', content_type);
				res.setHeader('Content-Length', data.length);
				res.setHeader('Type', 'image');
				res.setHeader('Content-Disposition', 'inline; filename='+id);
				res.setHeader('Cache-Control', 'must-revalidate,private');
				res.setHeader('Expires', '-1');
				res.setHeader('Last-Modified', poster.last_update.toUTCString());
				logger.info("Sending picture to browser");
				return res.send(data);
			});
		});
	},
	
	delete_posters: function(req, res, next) {
		logger.info('En DELETE posters');
		var id			= req.body.id;
		
		logger.debug("Starting poster deletion with id:"+id);
		logger.info("Getting poster");
		req.models.posters.get(id, function(err,poster) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			poster.remove(function (err) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				return res.status(200).send('removed');
			});
		});
	}
	
};
