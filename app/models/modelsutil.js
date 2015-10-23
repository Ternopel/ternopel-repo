'use strict';


function fillProductFormat(product,productformat) {
	var retaildescription		= '';
	var wholesaledescription	= '';
	var begin					= '<span class="price-con">$';
	var end						= '</span>';
	
	if( ( productformat.units%1 ) !=0) {
		// Ejemplo de esta condicion: Bobinas de papel diario
		retaildescription += productformat.units.toFixed(2)+' '+product.packaging.name + 's de ' + productformat.format+' a '+begin+productformat.retail.toFixed(2)+end+' c/u';
	}
	else if ( productformat.units === 1 ) {
		// Ejemplo de esta condicion: Bandas elasticas
		retaildescription += productformat.units.toFixed(2) +' '+product.packaging.name + ' de ' + productformat.format+' a '+begin+productformat.retail.toFixed(2)+end;
	}
	else {
		// Ejemplo de esta condicion: Blondas de papel caladas
		retaildescription += product.packaging.name +' '+ productformat.units + ' unid. de ' + productformat.format+' a '+begin+productformat.retail.toFixed(2)+end+' c/u';
	}
	
	wholesaledescription	+= productformat.quantity+' '+product.packaging.name+'s de '+begin+productformat.wholesale.toFixed(2)+end+' c/u a '+begin+(productformat.wholesale*productformat.quantity).toFixed(2)+end;
		
	productformat.retaildescription		= retaildescription;
	productformat.wholesaledescription	= wholesaledescription;
}

(function (modelsutil) {

	modelsutil.getCategories = function (req,res,next,getcallback) {
	
		var ld = require('lodash');
		
		req.logger.info("Getting all categories");
		req.db.driver.execQuery("select * from plain_info order by c_name, p_name, pf_retail",function(err,records) {
			req.logger.info("Records found:"+records.length);
			if(err) {
				return getcallback(err);
			}
			var c_name = '';
			var p_name = '';
			var categories	= [];
			records.forEach(function(record) {
				if(record.c_name !== c_name) {
					req.logger.debug('----------> New category:'+record.c_name);
					var category		= ld.merge({id: record.c_id,name:record.c_name, url:record.c_url});
					category.products	= [];
					categories.push(category);
					c_name = record.c_name;
				}
				
				if(record.p_name !== p_name) {
					req.logger.debug('----------> New product:'+record.p_name);
					var lastcategory		= categories[categories.length - 1];
					var packaging			= ld.merge({id: record.pk_id,name:record.pk_name});
					var product				= ld.merge({id: record.p_id,name:record.p_name, url:record.p_url,is_visible: record.p_is_visible, is_offer: record.p_is_offer, packaging:packaging});
					product.productsformats = [];
					lastcategory.products.push(product);
					p_name = record.p_name;
				}
				var lastproduct		= categories[categories.length - 1].products[categories[categories.length - 1].products.length - 1];
				var productformat	= ld.merge({id:record.pf_id, format:record.pf_format, quantity:record.pf_quantity, units:record.pf_units, wholesale:record.pf_wholesale, retail:record.pf_retail});
				fillProductFormat(lastproduct,productformat);
				lastproduct.productsformats.push(productformat);
			
			});
			req.logger.debug(JSON.stringify(categories));
			return getcallback(null,categories);
		});
	};

	modelsutil.getProducts = function (req,res,next,filters,getcallback) {
		
		var async		= require('async'),
			ld			= require('lodash');
		
		req.logger.debug('Entering to get_products');
		var productsfind	= req.models.products.find(filters.filter,['name']);
		if(filters.search) {
			productsfind.where('lower(name) ilike ?',['%'+filters.search+'%']);
		}
		if(filters.productslimit) {
			productsfind.limit(filters.productslimit);
		}
		productsfind.run(function(err,products) {
			if(err) {
				return next(err);
			}
			req.logger.debug('Products readed:'+products.length);
			async.each(products, function(product, callback) {
				var productsformatsfind = product.getProductsFormats().order('retail');
				if(filters.formatslimit) {
					productsformatsfind.limit(filters.formatslimit);
				}
				productsformatsfind.run(function(err,productformats) {
					if(err) {
						return callback(err);
					}
					productformats.forEach(function(productformat) {
						fillProductFormat(product,productformat);
					});
					req.logger.debug("Product:"+product.name+" Formats readed:"+productformats.length);
					ld.merge(product, {productformats:productformats});
					product.getCategory(function(err,category) {
						if(err) {
							return callback(err);
						}
						req.logger.debug("Product:"+product.name+" Category:"+category.name);
						ld.merge(product, {category:category});
						return callback();
					});
				});
			}, function(err) {
				return getcallback(err,products);
			});
		});
	};
	
	
	modelsutil.getPosters = function (req,res,next,getcallback) {
		req.models.posters.find({},['position'],function(err,posters) {
			if(err) {
				return getcallback(err);
			}
			posters.forEach(function(poster) {
				if(poster.product_id) {
					poster.origin	= 'Producto:'+poster.product.name;
					poster.url		= poster.category.url+"/"+poster.product.url;
				}
				else {
					poster.origin	= 'Categoría:'+poster.category.name;
					poster.url		= poster.category.url;
				}
				req.logger.info(JSON.stringify(poster));
			});
			return getcallback(null,posters);
		});
	};
	
	
})(module.exports);
