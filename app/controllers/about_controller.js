module.exports = {
	get_about: function(req, res, next) {
		
		req.logger.info('Starting waterfall');
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.info('Reading template file');
				var fs = require('fs');
				fs.readFile('./app/reports/products_by_category.html', "utf8", function (err, data) {
					if (err) {
						return callback(err);
					}
					return callback(null,data);
				});
			},
			function(data,callback) {
				req.logger.info('Reading categories');
				req.models.categories.find({},['name'],function(err,categories) {
					if(err) {
						return callback(err);
					}
					return callback(null,data,categories);
				});
			},
			function(data,categories, callback) {
				req.logger.info('Generating report');
				jsreport = require('jsreport');
				jsreport.render({
					template: {
						content: data,
						engine: "jsrender"
					},
					data: { 
						categories: categories 
					}
				}).then(function(out) {
					return callback(null,out);
				}).catch(function(e) {
					return callback(e.message);
				});
			}
		], 
		function(err,out) {
			if(err) {
 				next(err);
			}
			else {
				out.stream.pipe(res);
			}
		});


		
		/*
		var fs			= require('fs');
		var jsreport	= require('jsreport');	
		fs.readFile('./app/reports/products_by_category.html', "utf8", function (err, data) {
			if (err) {
				next(err);
			}
			req.logger.info(data);
			jsreport.render(data).then(function(out) {
				out.stream.pipe(res);
			}).catch(function(e) {
				res.end(e.message);
			});		
		});		
		*/
	
	}
};
