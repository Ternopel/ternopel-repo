'use strict';

(function (cronconfig) {

	cronconfig.sendregistrationmails = function (logger, config, models) {
		logger.info('You will see this message every minute 222');
		models.registrations.find({},function(err,registrations) {
			if(err) {
				logger.error("Cron error:"+err);
			}
			registrations.forEach(function(registration) {
				logger.info(JSON.stringify(registration));
			});
		});
	};

	cronconfig.init = function (logger, config, models) {
		if(config.app_cron === 'true') {
			logger.debug("Cron is enabled");
			var CronJob = require('cron').CronJob;
			new CronJob('0 * * * * *', function() {
				logger.info('You will see this message every minute 111');
				cronconfig.sendregistrationmails(logger,config,models);
			}, null, true, 'America/Buenos_Aires');
			
			
		}
	};
	
})(module.exports);
