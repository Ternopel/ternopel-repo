'use strict';

var modelsutil	= require('../app/models/modelsutil');

(function (reportutil) {

	reportutil.report = function(logger, db, recipe, generalcallback) {
		
		logger.info('Starting waterfall');
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Reading template file');
				var fs = require('fs');
				fs.readFile('./app/reports/products_by_category.html', "utf8", function (err, content) {
					return callback(err,content);
				});
			},
			function(content,callback) {
				logger.info('Reading categories');
				modelsutil.getCategories(logger, db, { getformatswithnoprice:true,includeunique:true },function(err,categories) {
					return callback(err,content,categories);
				});
			},
			function(content,categories, callback) {
				logger.info('Generating report gif');
				var jsreport = require('jsreport');
				jsreport.render({
					template: {
						content: content,
						recipe: recipe,
						engine: "jsrender",
						phantom: {
							header: "<h2 style='background-color: lightGray'>Listado de Productos por Categor&iacute;a</h2>",
							footer: "<div style='text-align:center'>Página {#pageNum} de {#numPages}</div>",
							orientation: "portrait",
							width: "600px"
						},
						phantomImage: {
							imageType: 'jpeg',
							quality: 100
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
			return generalcallback(err,out);
		});
	};

})(module.exports);