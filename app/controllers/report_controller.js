module.exports = {
	get_report: function(req, res, next) {
		
		req.logger.info('Starting waterfall');
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				req.logger.info('Reading template file');
				var fs = require('fs');
				fs.readFile('./app/reports/products_by_category.html', "utf8", function (err, content) {
					if (err) {
						return callback(err);
					}
					return callback(null,content);
				});
			},
			function(content,callback) {
				req.logger.info('Reading categories');
				req.models.categories.find({},['name'],function(err,categories) {
					if(err) {
						return callback(err);
					}
					return callback(null,content,categories);
				});
			},
			function(content,categories, callback) {
				req.logger.info('Generating report');
				jsreport = require('jsreport');
				jsreport.render({
					template: {
						content: content,
						engine: "jsrender",
						phantom: {
							header: "<table> <tr> <td><h1>Listado de Productos por Categor&iacute;a<h1></td> <td style='text-align: right; width:350px;'><h1>Ternopel</h1></td> </tr> </table>",
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
