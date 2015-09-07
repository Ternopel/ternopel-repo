'use strict';

(function (cronconfig) {

	cronconfig.sendregistrationmails = function (logger, config, models,callback) {
		
		var nodemailer = require("nodemailer");
		
		var smtpTransport = nodemailer.createTransport("SMTP",{
			service: "Gmail",
			auth: {
				user: "info@ternopel.com",
				pass: config.app_smtp_password
			}
		});		
		
		models.registrations.find({sent:false},function(err,registrations) {
			if(err) {
				return callback(err);
			}
			
			var async	= require('async');
			var url		= "http://"+config.app_proxy_host;
			if(config.app_proxy_port!==80) {
				url	+=":"+config.app_proxy_port;
			}
			async.each(registrations, function(registration, mycallback) {
				smtpTransport.sendMail({
					from: "Información Ternopel <info@ternopel.com>",
					to: "<"+registration.email_address+">", 
					subject: "Confirmación de registración en Papelera Ternopel ✔", 
					html: "Bienvenido a Papelera Ternopel !!<br/> Por favor, haga <a href='"+url+"/registration/"+registration.token+"'>click aqui</a> para confirmar su correo. Gracias !"
				}, function(error, response){
					if(error){
						return mycallback(error);
					}
					else{
						logger.info("Message sent: " + response.message);
						registration.sent = true;
						registration.save(function(err) {
							return mycallback(err);
						});
					}
				});		
			}, function(err) {
				return callback(err);
			});
		});
	};

	cronconfig.init = function (logger, config, models) {
		if(config.app_cron === 'true') {
			logger.debug("Cron is enabled");
			var CronJob = require('cron').CronJob;
			var GmailJob = new CronJob('0 * * * * *', function() {
				logger.info('You will see this message every minute');
				cronconfig.sendregistrationmails(logger,config,models,function(err) {
					if(err) {
						logger.error(err);
					}
					logger.info("Cron runned successfully");
				});
			}, null, true, 'America/Buenos_Aires');
			
			
		}
	};
	
})(module.exports);
