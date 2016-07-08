'use strict';

var elasticsearch	= require('elasticsearch'),
	utils			= require('./utils'),
	async			= require('async'),
	logger			= require("../../utils/logger")(module);

function get_client(req, res, callback) {

	var client = new elasticsearch.Client({
		host: req.config.app_elastic_host,
		log: req.config.app_log_level
	});
	
	client.ping({
			// undocumented params are appended to the query string
			hello: "elasticsearch!"
		}, 
		function (err) {
			return callback(err,client);
		}
	);	
};

module.exports = {
	get_reindex: function(req, res, next) {

		var indexName = req.config.app_elastic_index;
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Getting Elastic client');
				get_client(req,res,function(err,client) {
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
							p_name:		{ type: "string" },
							c_name:		{ type: "string" },
							pf_format:	{ type: "string" },
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
				logger.info('Populating Elastic index ');
				var query = "select p_id, p_name, c_name, array_to_string(array_agg(pf_format),' ','') as pf_format FROM plain_info ";
				query += "group by p_id, p_name, c_name";
				
				req.db.driver.execQuery(query,function(err,records) {
					if(err) {
						return callback(err);
					}
					logger.info('Records to index:'+records.length);
					async.each(records, function(record, mycallback) {
						
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
						return callback(err);
					});
				});
			} 
		], 
		function(err) {
			if(err) {
				logger.error(err);
				return utils.send_ajax_error(req,res,err);
			}
			return res.status(200).send('OK');
		});
	},
	get_search: function(req, res, next) {
		var indexName = req.config.app_elastic_index;

		get_client(req,res,function(err,client) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			var search = req.params.search;

			client.search({
				index:	indexName,
				type:	'document',
				q: 		'p_name:'+search
			}, 
			function (err, response) {
				if(err) {
					return utils.send_ajax_error(req,res,err);
				}
				logger.info(JSON.stringify(response));
				response.hits.hits.forEach(function (hit) {
					logger.info('Score:'+hit._score+" Id:"+hit._id+" p_name:"+hit._source.p_name);
				});	
				return res.status(200).send('OK '+response.hits.hits.length);
			});
		});
	}
};


	

