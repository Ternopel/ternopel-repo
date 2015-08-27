'use strict';

var utils	= require('./utils'),
	fs		= require('fs'),
	ld		= require('lodash');


function save_or_update_posters(method, req, res, next) {

	req.logger.debug("Defining validators");
	req.assert('is_product', 'El flag indicando tipo de poster es requerido').notEmpty();
	req.assert('position', 'El orden del cartel es requerido').notEmpty();
	if(method==='PUT') {
		req.assert('type', 'Por favor, cargue el archivo').notEmpty();
		req.assert('data', 'El stream del archivo es requerido').notEmpty();
	}
	if(method==='POST') {
		req.assert('id', 'El id del cartel es requerido').notEmpty();
	}
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
	req.models.posters.find({position:req.body.position}, function(err,posters) {
		if(err) {
			return utils.send_ajax_error(req,res,err);
		}
		if( ( method === 'PUT' && posters.length===1 ) || ( method === 'POST' && posters.length===1 && posters[0].id != req.body.id ) ) {
			return utils.send_ajax_error(req,res,'El valor asignado al orden existe en otro cartel ('+posters[0].id+')');
		}
		
		if(method==='PUT') {
			req.logger.info('Creating poster');
			req.models.posters.create({	category_id:req.body.category_id,
										product_id:req.body.product_id,
										content_type:req.body.type,
										last_update:new Date(),
										position:req.body.position},function(err,poster) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				var picture_name=req.config.app_posters_imgs_dir+"/"+poster.id;
				req.logger.info('Writing picture:'+picture_name);
				fs.writeFile(picture_name, req.body.data,'base64',function (err) {
					if(err) {
						return utils.send_ajax_error(req,res,err);
					}
					req.logger.debug("Sending response to browser");
					return res.status(200).send('created');
				});
			});
		}
		if(method==='POST') {
			req.logger.info('Updating poster');
			req.models.posters.get(req.body.id,function(err,poster) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}			
				poster.position = req.body.position;
				if(req.body.is_product==='true') {
					req.logger.info("*********************************************");
					req.logger.info("1");
					req.logger.info("*********************************************");
					poster.product_id	= req.body.product_id;
				}
				else {
					req.logger.info("*********************************************");
					req.logger.info("1");
					req.logger.info("*********************************************");
					poster.category_id	= req.body.category_id;
				}
				poster.save(function(err) {
					if(err) {
						return utils.send_ajax_error(req,res,err);
					}
					if(req.body.data) {
						var picture_name=req.config.app_posters_imgs_dir+"/"+poster.id;
						req.logger.info('Writing picture:'+picture_name);
						fs.writeFile(picture_name, req.body.data,'base64',function (err) {
							if(err) {
								return utils.send_ajax_error(req,res,err);
							}
							req.logger.debug("Sending response to browser");
							return res.status(200).send('updated');
						});
					}
					else {
						req.logger.info('Sending response without saving image');
						return res.status(200).send('updated');
					}
				});
			});
		}
	});
}

module.exports = {
		
	get_add_page: function(req, res, next) {
		req.logger.info('En GET ADD PAGE');
		var poster		= ld.merge({position:''});
		var pageinfo	= ld.merge(req.pageinfo, {method:'PUT',csrfToken: req.csrfToken(),poster:poster});
		req.models.categories.find({},['name'],function(err,categories) {
			if(err) {
				return next(err);
			}
			ld.merge(pageinfo, {categories:categories});
			req.logger.debug('Categories readed:'+categories.length);
			req.logger.info("******************************************************");
			req.logger.info(JSON.stringify(pageinfo));
			req.logger.info("******************************************************");
			
			
			res.render('form_poster.html',pageinfo);
		});
	},		

	get_edit_page: function(req, res, next) {
		req.logger.info('En GET EDIT PAGE');
		req.models.posters.get(req.params.id,function(err,poster) {
			if(err) {
				next(err);
			}
			var pageinfo	= ld.merge(req.pageinfo, {method:'POST',csrfToken: req.csrfToken(),poster:poster});
			res.render('form_poster.html',pageinfo);
		});
	},		
		
	get_posters: function(req, res, next) {
		req.logger.info('En GET posters');
		req.models.posters.find({},['position'],function(err,posters) {
			if(err) {
				return next(err);
			}
			var pageinfo	= ld.merge(req.pageinfo, {posters:posters, csrfToken: req.csrfToken()});
			res.render('admin_posters.html',pageinfo);
		});
	},

	put_posters: function(req, res, next) {
		req.logger.info('En PUT posters');
		save_or_update_posters('PUT',req,res,next);
	},
	
	post_posters: function(req, res, next) {
		req.logger.info('En POST posters');
		save_or_update_posters('POST',req,res,next);
	},
	
	get_picture: function(req, res, next) {
		req.logger.info("En GET poster pictures 222");
		var id			= req.params.id;
		
		req.logger.info("Getting poster info");
		req.models.posters.get(id,function(err,poster) {
			
			if(err && err.literalCode!=='NOT_FOUND') {
				return utils.send_ajax_error(req,res,err);
			}			

			var picture_name;
			var content_type;
			if(err && err.literalCode==='NOT_FOUND') {
				picture_name='./public/images/default-img.jpg';
				content_type='image/jpeg';
			}	
			else {
				picture_name=req.config.app_posters_imgs_dir+"/"+id;
				content_type=poster.content_type;
			}
			
			req.logger.info("Reading image "+picture_name);
			fs.readFile(picture_name, function (err, data) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
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
