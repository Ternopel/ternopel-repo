'use strict';

var utils	= require('./utils'),
	fs		= require('fs');

module.exports = {
	post_productspictures: function(req, res, next) {
		req.logger.info("En POST products pictures");
		var id			= req.body.id;
		
		req.logger.info("Id:"+id);
		req.logger.debug(JSON.stringify(req.files));
		
		fs.readFile(req.files.picture.path, function (err, data) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			
			var buffer = new Buffer(data);
			req.models.productspictures.get(id,function(err,productpicture) {
				// Not found !
				if(err && err.literalCode!=='NOT_FOUND') {
					return utils.send_ajax_error(req,res,err);
				}
				if(productpicture) {

					productpicture.picture		= buffer.toString('base64');
					productpicture.last_update	= new Date();
					
					req.logger.info('Updating product picture');
					productpicture.save(function(err) {
							if(err) {
								return utils.send_ajax_error(req,res,err);
							}
							req.logger.debug("Sending product picture ack to browser:");
							return res.status(200).send(id);
						});
				}
				else {
					req.logger.info('Creating product picture');
					req.models.productspictures.create({id:				id,
														last_update:	new Date(),
														picture:		buffer.toString('base64')},
						function(err,productpicture) {
							if(err) {
								return utils.send_ajax_error(req,res,err);
							}
							req.logger.debug("Sending product picture ack to browser:");
							return res.status(200).send(id);
						});
				}
			});
		});
	},
	get_productspictures: function(req, res, next) {
		req.logger.info("En GET products pictures");
		var id			= req.params.id;
		
		req.models.productspictures.get(id,function(err,productpicture) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			res.setHeader('Content-Type', 'png');
			res.setHeader('Content-Length', productpicture.picture.length);
			res.setHeader('Content-Disposition', 'inline; filename='+'X.png');
			return res.send(productpicture.picture);
		});
	}
};
