'use strict';

var utils	= require('./utils'),
	fs		= require('fs');

module.exports = {
	post_productspictures: function(req, res, next) {
		req.logger.info("En POST products pictures");
		var id			= req.body.id;
		
		req.logger.info("Id:"+id);
		
		fs.readFile(req.files['picture'].path, function (err, data) {
			req.logger.info("MEC>1");
			if(err) {
				return next(err);
			}
			req.logger.info("MEC>2");
			fs.writeFile("e:/imagen.jpg", data, function (err) {
				req.logger.info("MEC>3");
				res.redirect("back");
			});
		});
	},
};


