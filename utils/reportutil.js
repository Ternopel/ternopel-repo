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
				modelsutil.getCategories(db, { getformatswithnoprice:true,includeunique:true, highlight: 'report' },function(err,categories) {
					return callback(err,content,categories);
				});
			},
			function(content,categories, callback) {
				
				var newcategories = [];
				categories.forEach(function(category) {
					var newcategory = { name: category.name };
					newcategory.productsformats	= [];
					newcategory.has_wholesale	= false;
					category.products.forEach(function(product) {
						var first		= true;
						product.productsformats.forEach(function(productformat) {
							var newproductformat = {};
							if(first) {
								newproductformat.productname = product.name;
								first = false;
							}
							if(productformat.wholesaledescription) {
								newcategory.has_wholesale	= true;
							}
							newproductformat.retaildescription		= productformat.retaildescription;
							newproductformat.wholesaledescription	= productformat.wholesaledescription;
							
							newcategory.productsformats.push(newproductformat);
						});
					});
					newcategories.push(newcategory);
				});
				logger.info(JSON.stringify(newcategories,null,'\t'));
				
				
				logger.info('Generating report gif');
				var jsreport = require('jsreport');
				jsreport.render({
					template: {
						content: content,
						recipe: recipe,
						engine: "jsrender",
						phantom: {
							header: "<h2 style='background-color: lightGray; font-size: 12px;'><span>Productos por Categor&iacute;a</span><span style='margin-left:40%;'>Ternopel - email: info@ternopel.com - WhatsApp: 15-5888-3335</span></h2>",
							footer: "<div style='text-align:center;font-size: 12px;'>Página {#pageNum} de {#numPages}</div>",
							orientation: "portrait",
							width: "600px"
						},
						phantomImage: {
							imageType: 'jpeg',
							quality: 100
						}
					},
					data: { 
						categories: newcategories 
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