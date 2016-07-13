'use strict';

var utils			= require('./utils'),
	async			= require('async'),
	logger			= require("../../utils/logger")(module);

(function (redis_controller) {
	
	redis_controller.get_client = function (config,callback) {
		var redis = require('redis');
		var client = redis.createClient({port:config.app_redis_port, host:config.app_redis_host, prefix:config.app_redis_namespace});
		
		client.on("connect", function () {
			logger.info('Connected to redis');
			return callback(null,client);
		});
		client.on("error", function (err) {
			logger.error('NOT connected to redis. Error:'+err);
			return callback(err);
		});
	};
	
	redis_controller.upload_sessions = function(req, res, next) {
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info('Getting Redis client');
				redis_controller.get_client(req.config, function(err,client) {
					return callback(err,client);
				});
			},
			function(client, callback) {
				logger.info('Reading all saved sessions');
				req.models.userssessions.find({}).run(function(err,usersessions) {
					if(err) {
						return callback(err);
					}
					logger.info("Sessions to upload:"+usersessions.length);
					async.each(usersessions, function(usersession, mycallback) {
						logger.info(usersession.token);
						client.set(usersession.token, JSON.stringify(usersession), function (err, reply) {
							return mycallback(err);
						});
					},function(err) {
						return callback(err,client);
					});
				});
			},
			function(client, callback) {
				logger.info('Reading ending communication');
				client.end(true);
				return callback();
			}
		], 
		function(err) {
			if(err) {
				logger.error(err);
				return utils.send_ajax_error(req,res,err);
			}
			return res.status(200).send('OK');
		});		
	};

})(module.exports);
