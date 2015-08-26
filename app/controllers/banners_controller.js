'use strict';

var utils	= require('./utils'),
	fs		= require('fs'),
	ld		= require('lodash');

module.exports = {
		
		/*
	get_add_page: function(req, res, next) {
		req.logger.info('En GET ADD PAGE');
		var banner = ld.merge({position:''});
		var pageinfo	= ld.merge(req.pageinfo, {method:'PUT',csrfToken: req.csrfToken(),banner:banner});
		res.render('form_banner.html',pageinfo);
	},		

	get_edit_page: function(req, res, next) {
		req.logger.info('En GET EDIT PAGE');
		req.models.banners.get(req.params.id,function(err,banner) {
			if(err) {
				next(err);
			}
			var pageinfo	= ld.merge(req.pageinfo, {method:'POST',csrfToken: req.csrfToken(),banner:banner});
			res.render('form_banner.html',pageinfo);
		});
	},		
		
	get_banners: function(req, res, next) {
		req.logger.info('En GET banners');
		req.models.banners.find({},['position'],function(err,banners) {
			if(err) {
				return next(err);
			}
			var pageinfo	= ld.merge(req.pageinfo, {banners:banners, csrfToken: req.csrfToken()});
			res.render('admin_banners.html',pageinfo);
		});
	},
	
	put_banners: function(req, res, next) {
		req.logger.info('En PUT banners');

		req.logger.debug("Defining validators");
		req.assert('is_product', 'El flag indicando tipo de banner es requerido').notEmpty();
		req.assert('type', 'El tipo de archivo es requerido').notEmpty();
		req.assert('data', 'El stream del archivo es requerido').notEmpty();
		req.assert('position', 'El orden del cartel es requerido').notEmpty();
		if(req.body.is_product) {
			if(req.body.is_product==='true') {
				req.assert('product_id', 'El código de producto es requerido').notEmpty();
			}
			else {
				req.assert('category_id', 'El código de categoría es requerido').notEmpty();
			}
		}

		req.logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}
		
		req.logger.info("Searching for existing position");
		req.models.banners.find({position:req.body.position}, function(err,banners) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			if(banners.length===1) {
				return utils.send_ajax_error(req,res,'El valor asignado al orden existe en otro cartel ('+banners[0].id+')');
			}
			req.logger.info('Creating banner');
			req.models.banners.create({	category_id:req.body.category_id,
										product_id:req.body.product_id,
										content_type:req.body.type,
										last_update:new Date(),
										position:req.body.position},function(err,banner) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				var picture_name=req.config.app_banners_imgs_dir+"/"+banner.id;
				req.logger.info('Writing picture:'+picture_name);
				fs.writeFile(picture_name, req.body.data,'base64',function (err) {
					if(err) {
						return utils.send_ajax_error(req,res,err);
					}
					req.logger.debug("Sending response to browser");
					return res.status(200).send('created');
				});
			});
		});
		
		
	},
	*/
	get_picture: function(req, res, next) {
		req.logger.info("En GET banner pictures 222");
		var id			= req.params.id;
		
		req.logger.info("Getting banner info");
		req.models.banners.get(id,function(err,banner) {
			
			req.logger.info('MEC>1');
			if(err && err.literalCode!=='NOT_FOUND') {
				return utils.send_ajax_error(req,res,err);
			}			

			var picture_name;
			var content_type;
			req.logger.info('MEC>2');
			if(err && err.literalCode==='NOT_FOUND') {
				req.logger.info('MEC>3');
				picture_name='./public/images/default-img.jpg';
				content_type='image/jpeg';
			}	
			else {
				req.logger.info('MEC>4');
				picture_name=req.config.app_banners_imgs_dir+"/"+id;
				content_type=banner.content_type;
			}
			
			req.logger.info("Reading image "+picture_name);
			fs.readFile(picture_name, function (err, data) {
				req.logger.info('MEC>5');
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				req.logger.info('MEC>6');
				req.logger.info("Preparing picture metadata");
				res.setHeader('Content-Type', content_type);
				res.setHeader('Content-Length', data.length);
				res.setHeader('Content-Disposition', 'inline; filename='+id);
				
				req.logger.info("Sending picture to browser");
				return res.send(data);
			});
		});
	}
};
