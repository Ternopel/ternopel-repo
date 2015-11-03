'use strict';

module.exports = {
	get_report: function(req, res, next) {
		
		req.logger.info('Starting waterfall');
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.info('Reading template file');
				var fs = require('fs');
				fs.readFile('./app/reports/products_by_category.html', "utf8", function (err, content) {
					return callback(err,content);
				});
			},
			function(content,callback) {
				var modelsutil	= require('../models/modelsutil');
				req.logger.info('Reading categories');
				modelsutil.getCategories(req,res,next,function(err,categories) {
					return callback(err,content,categories);
				});
			},
			function(content,categories, callback) {
				req.logger.info('Generating report');
				var jsreport = require('jsreport');
				jsreport.render({
					template: {
						content: content,
						engine: "jsrender",
						phantom: {
							header: "<h2 style='background-color: lightGray'>Listado de Productos por Categor&iacute;a</h2>",
							footer: "<div style='text-align:center'>Página {#pageNum} de {#numPages}</div>",
							orientation: "portrait",
							width: "600px"
						}
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
	}
};
