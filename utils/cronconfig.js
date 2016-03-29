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
			var url		= "https://"+config.app_proxy_host;
			if(config.app_proxy_port!==443) {
				url	+=":"+config.app_proxy_port;
			}
			async.each(registrations, function(registration, mycallback) {
				smtpTransport.sendMail({
					from: "Información Papelera Ternopel <info@ternopel.com>",
					to: "<"+registration.email_address+">", 
					subject: "Confirmación de registración en Papelera Ternopel ✔", 
					html: "Bienvenido a Papelera Ternopel !!<br/> Por favor, haga <a href='"+url+"/registration/"+registration.token+"'>click aqui</a> para confirmar su correo. Gracias !"
				}, function(error, response){
					if(error){
						return mycallback(error);
					}
					else{
						logger.info("Message sent: " + response.message);
						registration.verified	= false;
						registration.sent		= true;
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

	cronconfig.sendmailingmails = function (logger, config, models,callback) {
		
		var nodemailer = require("nodemailer");
		
		var smtpTransport = nodemailer.createTransport("SMTP",{
			service: "Gmail",
			auth: {
				user: "info@ternopel.com",
				pass: config.app_smtp_password
			}
		});		
		
		models.mailing.find({sent:false},function(err,mailings) {
			if(err) {
				return callback(err);
			}
			
			var async	= require('async');
			var url		= "https://"+config.app_proxy_host;
			if(config.app_proxy_port!==443) {
				url	+=":"+config.app_proxy_port;
			}
			async.each(mailings, function(mailing, mycallback) {
				smtpTransport.sendMail({
					from: "Información Papelera Ternopel <info@ternopel.com>",
					to: "<"+mailing.email_address+">", 
					subject: "Confirmación de registración en Papelera Ternopel ✔", 
					html: "Bienvenido a Papelera Ternopel !!<br/> Por favor, haga <a href='"+url+"/mailing/"+mailing.token+"'>click aqui</a> para confirmar que desea recibir nuestro listado de precios. Gracias !"
				}, function(error, response){
					if(error){
						return mycallback(error);
					}
					else{
						logger.info("Message sent: " + response.message);
						mailing.verified	= false;
						mailing.sent		= true;
						mailing.save(function(err) {
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
			var RegistrationJob = new CronJob('0 * * * * *', function() {
				logger.info('You will see this message every minute');
				cronconfig.sendregistrationmails(logger,config,models,function(err) {
					if(err) {
						logger.error(err);
					}
					logger.info("Cron runned successfully");
				});
			}, null, true, 'America/Buenos_Aires');
			var MailingJob = new CronJob('30 * * * * *', function() {
				logger.info('You will see this message every minute');
				cronconfig.sendmailingmails(logger,config,models,function(err) {
					if(err) {
						logger.error(err);
					}
					logger.info("Cron runned successfully");
				});
			}, null, true, 'America/Buenos_Aires');
			
			
		}
	};
	
})(module.exports);
