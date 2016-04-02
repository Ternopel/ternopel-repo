'use strict';

var logger		= require("../../utils/logger")(module);

function fillProductFormat(product,productformat,filters) {
	if(productformat.id) {
		var retaildescription		= '';
		var wholesaledescription	= '';
		var begin					= '<span class="price-con">$';
		var end						= '</span>';
		
		if( ( productformat.units%1 ) !==0) {
			// Ejemplo de esta condicion: Bobinas de papel diario
			retaildescription += productformat.units.toFixed(2)+' '+product.packaging.name + 's de ' + productformat.format;
		}
		else if ( productformat.units === 1 ) {
			// Ejemplo de esta condicion: Bandas elasticas
			retaildescription += productformat.units +' '+product.packaging.name + ' de ' + productformat.format;
		}
		else {
			// Ejemplo de esta condicion: Blondas de papel caladas
			retaildescription += product.packaging.name +' '+ productformat.units + ' unid. de ' + productformat.format;
		}
		if(productformat.retail !==0 && filters.includeunique) {
			retaildescription += ' a '+begin+productformat.retail.toFixed(2)+end;
			if ( productformat.units !== 1 ) {
				retaildescription += ' c/u';
			}
		}
		
		if(productformat.retail !==0 && productformat.wholesale !== 0) {
			wholesaledescription	+= productformat.quantity+' '+product.packaging.name+'s de '+begin+productformat.wholesale.toFixed(2)+end+' c/u a '+begin+(productformat.wholesale*productformat.quantity).toFixed(2)+end;
		}
		
		productformat.retaildescription		= retaildescription;
		productformat.wholesaledescription	= wholesaledescription;
		productformat.quantity				= productformat.quantity.toFixed(2);
		productformat.units					= productformat.units.toFixed(2);
		productformat.retail				= productformat.retail.toFixed(2);
		productformat.wholesale				= productformat.wholesale.toFixed(2);
	}
}

(function (modelsutil) {

	modelsutil.getCategories = function (db,filters,getcallback) {
	
		var ld = require('lodash');
		
		logger.info("Getting all categories");
		var query = "select * from plain_info ";
		if(filters.getformatswithnoprice) {
			query += "where pf_retail <> 0 ";
		}
		if(filters.useformatid) {
			query += "where pf_id = "+filters.useformatid;
		}
		query += "order by c_name, p_name, pf_retail";
		db.driver.execQuery(query,function(err,records) {
			logger.info("Records found:"+records.length);
			if(err) {
				return getcallback(err);
			}
			var c_name = '';
			var p_name = '';
			var categories	= [];
			records.forEach(function(record) {
				if(record.c_name !== c_name) {
					logger.info('----------> New category:'+record.c_name);
					var category		= ld.merge({id: record.c_id,name:record.c_name, url:record.c_url});
					category.products	= [];
					categories.push(category);
					c_name = record.c_name;
				}
				
				if(record.p_name !== p_name) {
					logger.info('----------> New product:'+record.p_name);
					var lastcategory		= categories[categories.length - 1];
					var packaging			= ld.merge({id: record.pk_id,name:record.pk_name});
					var product				= ld.merge({id: record.p_id,name:record.p_name, url:record.p_url,is_visible: record.p_is_visible, is_offer: record.p_is_offer, packaging:packaging});
					product.productsformats = [];
					lastcategory.products.push(product);
					p_name = record.p_name;
				}
				var lastproduct		= categories[categories.length - 1].products[categories[categories.length - 1].products.length - 1];
				var productformat	= ld.merge({id:record.pf_id, format:record.pf_format, quantity:record.pf_quantity, units:record.pf_units, wholesale:record.pf_wholesale, retail:record.pf_retail});
				fillProductFormat(lastproduct,productformat,filters);
				lastproduct.productsformats.push(productformat);
			
			});
			logger.info("All categories obtained:"+categories.length);
			return getcallback(null,categories);
		});
	};

	modelsutil.getProducts = function (models, filters,getcallback) {
		
		var async		= require('async'),
			ld			= require('lodash');
		
		logger.info('Entering to get_products');
		var productsfind	= models.products.find(filters.filter,['name']);
		if(filters.search) {
			productsfind.where('lower(name) ilike ?',['%'+filters.search+'%']);
		}
		if(filters.productslimit) {
			productsfind.limit(filters.productslimit);
		}
		productsfind.run(function(err,products) {
			if(err) {
				return getcallback(err);
			}
			logger.info('Products readed:'+products.length);
			async.each(products, function(product, callback) {
				async.parallel([ 
					function(callback) {
						logger.info('Getting packaging');
						models.packaging.get(product.packaging_id,function(err,packaging) {
							if(err) {
								return callback(err);
							}
							ld.merge(product, {packaging:packaging});
							logger.info('Getting packaging FINISHED');
							return callback();
						});
					}, 
					function(callback) {
						logger.info('Getting formats');
						var productsformatsfind = product.getProductsFormats().order('retail');
						if(filters.formatslimit) {
							productsformatsfind.limit(filters.formatslimit);
						}
						productsformatsfind.run(function(err,productformats) {
							if(err) {
								return callback(err);
							}
							logger.info('Formats readed:'+productformats.length);
							productformats.forEach(function(productformat) {
								fillProductFormat(product,productformat,{includeunique:true});
							});
							logger.info("Product:"+product.name+" Formats readed:"+productformats.length);
							ld.merge(product, {productformats:productformats});
							logger.info('Getting formats FINISHED');
							return callback();
						});						
					},
					function(callback) {
						logger.info('Getting categories');
						product.getCategory(function(err,category) {
							if(err) {
								return callback(err);
							}
							logger.info("Product:"+product.name+" Category:"+category.name);
							ld.merge(product, {category:category});
							logger.info('Getting categories FINISHED');
							return callback();
						});
					},					
					function(callback) {
						return callback();
					} 
				],
				function(err, results) {
					return callback(err);
				});				
			}, function(err) {
				logger.info("Number of products returned:"+products.length);
				return getcallback(err,products);
			});
		});
	};
	
	modelsutil.getPosters = function (models,getcallback) {
		
		var async		= require('async'),
			ld			= require('lodash');

		logger.info('Entering get posters');
		models.posters.find({},['position'],function(err,posters) {
			if(err) {
				return getcallback(err);
			}
			logger.info('Posters found:'+posters.length);
			
			async.each(posters, function(poster, callback) {
				models.categories.get(poster.category_id,function(err,category) {
					if(err) {
						return callback(err);
					}
					ld.merge(poster, {category:category});
					if(poster.product_id) {
						models.products.get(poster.product_id,function(err,product) {
							if(err) {
								return callback(err);
							}
							ld.merge(poster, {product:product});
							poster.origin	= 'Producto:'+poster.product.name;
							poster.url		= poster.category.url+"/"+poster.product.url;
							return callback();
						});
					}
					else {
						poster.origin	= 'Categoría:'+poster.category.name;
						poster.url		= poster.category.url;
						return callback();
					}
				});
			}, function(err) {
				return getcallback(err,posters);
			});
		});
	};
	
	
})(module.exports);
