'use strict';

var elasticsearch	= require('elasticsearch'),
	utils			= require('./utils'),
	async			= require('async'),
	logger			= require("../../utils/logger")(module);

(function (elastic_controller) {
	
	elastic_controller.remove_product = function (hostName,indexName,id,callback) {
		elastic_controller.get_client(hostName,function(err,client) {
			if(err) {
				return callback(err);	
			}
			client.delete({
				index: indexName,
				type: 'document',
				id: id
			}, 
			function (err, response) {
				return callback(err);
			});
		});
	},
		
	elastic_controller.index_product = function (hostName,indexName,db,id,callback) {
		elastic_controller.get_client(hostName,function(err,client) {
			if(err) {
				return callback(err);	
			}		
		
			logger.info('Populating Elastic index ');
			var query = "select p_id, p_name, c_name, array_to_string(array_agg(pf_format),' ','') as pf_format FROM plain_info ";
			if(id) {
				query += "where p_id = "+id+" ";
			}
			query += "group by p_id, p_name, c_name";
			
			db.driver.execQuery(query,function(err,records) {
				if(err) {
					return callback(err);
				}
				logger.info('Records to index:'+records.length);
				logger.info(JSON.stringify(records));
				async.each(records, function(record, mycallback) {
					
					logger.info('Indexing record id:'+record.p_id);
					
					client.index({
						index: indexName,
						type: 'document',
						id: record.p_id,
						body: {
							p_name: record.p_name,
							c_name: record.c_name,
							pf_format: record.pf_format,
							published: true,
						}
					}, function (err, response) {
						return mycallback(err);
					});
				},function(err) {
					return callback(err,records);
				});
			});
		});
	},
	
	elastic_controller.search = function(hostName,indexName,searchCriteria,callback) {
		elastic_controller.get_client(hostName,function(err,client) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			var should	= [];
			should.push({match: {p_name: {query:searchCriteria, fuzziness:2}}});
			should.push({match: {c_name: {query:searchCriteria, fuzziness:2}}});
			should.push({match: {pf_format: {query:searchCriteria, fuzziness:2}}});
			var content	= {query: {bool: { should: should }}};
			
			var request = require('request');
			// Configure the request
			var options = {
				url:		'http://'+hostName+'/'+indexName+'/document/_search?pretty',
				method:		'POST',
				form: JSON.stringify(content)
			}
			
			// Start the request
			request(options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					logger.info('-------------------------------------------------------');
					logger.info(body);
					logger.info('-------------------------------------------------------');
					return callback(error,JSON.parse(body));
				}
				else {
					return callback(error);
				}
			});
			/*
			client.search({
				index:	indexName,
				type:	'document',
				q: 		'p_name:'+searchCriteria
			}, 
			function (err, response) {
				return callback(err,response);
			});
			*/
		});
	};
	
	elastic_controller.get_client = function (hostName, callback) {
		var client = new elasticsearch.Client({
			host: hostName,
			log: 'trace'
		});
		
		client.ping({
				// undocumented params are appended to the query string
				hello: "elasticsearch!"
			}, 
			function (err) {
				return callback(err,client);
			}
		);	
	},
		
	
	elastic_controller.reindex = function(hostName,indexName,db,gencallback) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Getting Elastic client');
				elastic_controller.get_client(hostName, function(err,client) {
					return callback(err,client);
				});
			}, 
			function(client,callback) {
				logger.info('Controlling if Elastic index exists');
				client.indices.exists({
					index: indexName
				}, function(err,exists) {
					logger.info('Exists:'+exists);
					return callback(err,client,exists);
				});
			} ,
			function(client,exists,callback) {
				if(exists) {
					logger.info('Elastic index exists. Deleting it');
					client.indices.delete({
						index: indexName
					}, function(err) {
						return callback(err,client);
					});
				}
				else {
					logger.info('Elastic index does not exists');
					return callback(null,client);
				}
			},
			function(client,callback) {
				logger.info('Creating Elastic index ');
				client.indices.create({
					index: indexName
				}, 
				function (err, resp, respcode) {
					return callback(err,client);
				});
			}, 
			function(client,callback) {
				logger.info('Creating Elastic index mapping');
				client.indices.putMapping({
					index: indexName,
					type: "document",
					body: {
						properties: {
							id:			{ type: "long" },
							p_name:		{ type: "string", boost: "3.0" },
							c_name:		{ type: "string", boost: "1.0" },
							pf_format:	{ type: "string", boost: "0.5" },
							suggest: {
								type: "completion",
								analyzer: "simple",
								search_analyzer: "simple",
								payloads: true
							}
						}
					}
				},
				function(err) {
					return callback(err,client);
				});
			}, 
			function(client,callback) {
				elastic_controller.index_product(hostName,indexName,db,null,callback);
			} 
		], 
		function(err,records) {
			return gencallback(err,records);
		});
	};
	
	
	elastic_controller.get_reindex = function(req, res, next) {
		elastic_controller.reindex(req.config.app_elastic_host, req.config.app_elastic_index,req.db,function(err, records) {
			if(err) {
				logger.error(err);
				return utils.send_ajax_error(req,res,err);
			}
			return res.status(200).send('OK '+records.length);
		});
	};
	
	elastic_controller.get_search = function(req, res, next) {
		elastic_controller.search(req.config.app_elastic_host, req.config.app_elastic_index,req.params.search,function(err,response) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			logger.info(JSON.stringify(response));
			response.hits.hits.forEach(function (hit) {
				logger.info('Score:'+hit._score+" Id:"+hit._id+" p_name:"+hit._source.p_name);
			});	
			res.json(response);
			return res.end();
		});
	};
	
})(module.exports);
