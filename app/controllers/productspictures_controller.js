'use strict';

var utils	= require('./utils'),
	fs		= require('fs');

module.exports = {
	post_productspictures: function(req, res, next) {
		req.logger.info("En POST products pictures");
		var product_id	= req.body.product_id;
		var type		= req.body.type;
		var data		= req.body.data;
		
		req.logger.info("Id:"+product_id);
		req.logger.info("type:"+type);
		
		var picture_name=req.config.app_products_imgs_dir+"/"+product_id;
		req.logger.info('Writing picture:'+picture_name);
		fs.writeFile(picture_name, data,'base64',function (err) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			req.models.productspictures.get(product_id,function(err,productpicture) {
				// Not found !
				if(err && err.literalCode!=='NOT_FOUND') {
					return utils.send_ajax_error(req,res,err);
				}
				if(productpicture) {
					productpicture.content_type	= type;
					productpicture.last_update	= new Date();
					
					req.logger.info('Updating product picture');
					productpicture.save(function(err) {
						if(err) {
							return utils.send_ajax_error(req,res,err);
						}
						req.logger.debug("Sending product picture ack to browser:");
						return res.status(200).send('updated');
					});
				}
				else {
					req.logger.info('Creating product picture');
					req.models.productspictures.create({id:	product_id,last_update:	new Date(),content_type: type}, function(err,productpicture) {
						if(err) {
							return utils.send_ajax_error(req,res,err);
						}
						req.logger.debug("Sending product picture ack to browser:");
						return res.status(200).send('created');
					});
				}
			});
		});
},
	get_productspictures: function(req, res, next) {
		req.logger.info("En GET products pictures");
		var id			= req.params.id;
		
		req.logger.info("Getting product info");
		req.models.productspictures.get(id,function(err,productpicture) {
			
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
				picture_name=req.config.app_products_imgs_dir+"/"+id;
				content_type=productpicture.content_type;
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
