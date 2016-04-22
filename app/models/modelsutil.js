'use strict';

var logger		= require("../../utils/logger")(module);

function fillProductFormat(product,productformat,filters) {
	if(productformat.id) {
		var retaildescription		= '';
		var wholesaledescription	= '';
		var begin					= '<span class="price-con">$';
		var end						= '</span>';
//		if(filters.highlight==='report') {
//			begin					= '<b>';
//			end						= '</b>';
//		}
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

function fillProductsInfo(models,filters,product,getcallback) {
	
	var async		= require('async'),
		ld			= require('lodash');	
	
	var waterfall = require('async-waterfall');
	waterfall([ 
		function(callback) {
			logger.info('Getting packaging');
			models.packaging.get(product.packaging_id,function(err,packaging) {
				if(err) {
					return callback(err);
				}
				ld.merge(product, {packaging:packaging});
				return callback();
			});
		},
		function(callback) {
			logger.info('Getting products formats');
			var productsformatsfind = product.getProductsFormats();
			if(filters.formatslimit) {
				productsformatsfind.limit(filters.formatslimit);
			}
			logger.info('Searching formats');
			productsformatsfind.run(function(err,productformats) {
				if(err) {
					return callback(err);
				}
				
				productformats.sort(function(a,b) {
					var avalue = (a.retail===0?100000:a.retail);
					var bvalue = (b.retail===0?100000:b.retail);
					if(avalue !== bvalue) {
						logger.info("Order by retail");
						return avalue - bvalue;
					}
					else {
						logger.info("Order by format");
						avalue = a.format.toLowerCase();
						avalue = b.format.toLowerCase();
						if (avalue < bvalue) return 1;
						if (avalue > bvalue) return -1;
						return 0;
					}
				});
				
				logger.info('Formats readed:'+productformats.length);
				productformats.forEach(function(productformat) {
					fillProductFormat(product,productformat,{includeunique:true});
				});
				logger.info("Product:"+product.name+" Formats readed:"+productformats.length);
				ld.merge(product, {productformats:productformats});					
				return callback();
			});
		},
		function(callback) {
			logger.info('Searching for category');
			product.getCategory(function(err,category) {
				if(err) {
					return callback(err);
				}
				logger.info("Product:"+product.name+" Category:"+category.name);
				ld.merge(product, {category:category});
				return callback();
			});
		},
		function(callback) {
			logger.info('Searching for Pictures');
			product.getProductsPictures().order('id').run(function(err, productspictures) {
				if(err) {
					return callback(err);
				}
				logger.info('Pictures readed:'+productspictures.length);
				ld.merge(product, {productspictures:productspictures});
				return callback();
			});
		}					
	], 
	function(err) {
		logger.info("All product information gathered");
		return getcallback(err);
	});				
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
					logger.debug('----------> New category:'+record.c_name);
					var category		= ld.merge({id: record.c_id,name:record.c_name, url:record.c_url});
					category.products	= [];
					categories.push(category);
					c_name = record.c_name;
				}
				
				if(record.p_name !== p_name) {
					logger.debug('----------> New product:'+record.p_name);
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
				fillProductsInfo(models,filters,product,function(err) {
					return callback(err);
				}); 
			},function(err) {
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
	
	
	modelsutil.getProductsSearch = function (models, db,filters,getcallback) {
		
		var async		= require('async'),
			ld			= require('lodash');
		
		var searchwithsinglespace = filters.search.replace(/  +/g,'|').replace(/ /g,'|');
		
		logger.info('************************');
		logger.info(searchwithsinglespace);
		logger.info('************************');
		
		logger.info("Getting all categories");
		
		var ts_vector	= 'to_tsvector(\'english\',c.name||\' \'||p.name||\' \'||replace(pf.format,\'x\',\' x \'))';
		var ts_query	= 'to_tsquery(\''+searchwithsinglespace+'\')';
		var ts_rank		= 'ts_rank_cd('+ts_vector+","+ts_query+')';

		logger.info('ts_vector:'+ts_vector);
		logger.info('ts_queryr:'+ts_query);

		var query = "select "+ts_rank+", p.id from categories c, products p, products_formats pf where c.id = p.category_id and p.id = pf.product_id and ";
		query+= ts_vector+" @@ "+ts_query+" ";
		query+= "order by "+ts_rank+" desc";

		logger.info(query);
		db.driver.execQuery(query,function(err,records) {
			if(err) {
				return getcallback(err);
			}
			logger.info('Ids readed:'+JSON.stringify(records));
			
			var uniqueids = [];
			records.forEach(function(rec) {
				logger.info("Evaluating:"+rec.id);
				if(uniqueids.indexOf(rec.id)>=0) {
					logger.info("Existing!!");
				}
				else {
					logger.info("Adding!!");
					uniqueids.push(rec.id);
				}
			});
			
			logger.info('Ids UNIQUE:'+JSON.stringify(uniqueids));
			var products	= [];
			async.each(uniqueids, function(id, callback) {
				
				logger.info('Processing id:'+id);
				models.products.get(id,function(err,product) {
					if(err) {
						return callback(err);
					}
					products.push(product);
					fillProductsInfo(models,filters,product,function(err) {
						return callback(err);
					}); 
				});
			},function(err) {
				logger.info("Number of products returned:"+products.length);
				products.sort(function(a,b) {
					var aindex = ld.findIndex(uniqueids, function(id) { return id == a.id; });
					var bindex = ld.findIndex(uniqueids, function(id) { return id == b.id; });
					logger.info('------------->'+a.id+'='+aindex+' '+b.id+'='+bindex);
					return aindex - bindex;		
				});
				return getcallback(err,products);
			});			
		});
	};
	
})(module.exports);
