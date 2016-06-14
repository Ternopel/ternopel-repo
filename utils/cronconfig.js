'use strict';

var reportutil	= require("../utils/reportutil"),
	fs			= require('fs');

function save_price_listing(logger, config, smtpTransport, filename, records, callback) {
	var async	= require('async');
	var url		= "https://"+config.app_proxy_host;
	if(config.app_proxy_port!==443) {
		url	+=":"+config.app_proxy_port;
	}
	async.each(records, function(record, mycallback) {
		logger.info("Sending mail to:"+record.email_address);
		smtpTransport.sendMail({
			from: "Información Papelera Ternopel <info@ternopel.com>",
			to: "<"+record.email_address+">", 
			subject: "Listado de Precios ✔", 
			html: "Querido cliente ! Adjuntamos la lista de precios de nuestros productos actualizada ! Y no se olvide de visitar nuestra página: www.papeleraternopel.com",
			attachments: [
				{
					filename: 'listado-precios.pdf',
					filePath: filename,
					contentType: 'application/pdf'
				}
			]
		}, function(error, response){
			return mycallback(error);
		});		
	}, function(err) {
		return callback(err);
	});	
};

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

	cronconfig.sendmailingmails = function (logger, config, models, callback) {
		
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
	
	cronconfig.sendpricereportsmail = function (logger, config, models, db, filter, callback) {
		
		
		reportutil.report(logger, db, 'phantom-pdf', function(err,out) {
			if(err) {
				return callback(err);
			}
			
			logger.info("Writing file");
			var token		= require('node-uuid').v1();
			var filename	= '/tmp/output-'+token+'.pdf'
			out.result.pipe(fs.createWriteStream(filename));
			logger.info("Output file created !");
			
			var nodemailer = require("nodemailer");
			
			var smtpTransport = nodemailer.createTransport("SMTP",{
				service: "Gmail",
				auth: {
					user: "info@ternopel.com",
					pass: config.app_smtp_password
				}
			});		
			
			models.mailing.find(filter,function(err,mailings) {
				if(err) {
					return callback(err);
				}
				save_price_listing(logger, config, smtpTransport, filename, mailings,function(err) {
					if(err) {
						return callback(err);
					}
					
					if(filter.verified===true) {
						models.users.find({},function(err,users) {
							if(err) {
								return callback(err);
							}
							save_price_listing(logger, config, smtpTransport, filename, users,function(err) {
								return callback(err);
							});
						});
					}
					else {
						var async	= require('async');
						async.each(mailings, function(mailing, mycallback) {
							logger.info("Updating mailing:" + mailing.email_address);
							mailing.immediate	= false;
							mailing.save(function(err) {
								return mycallback(err);
							});
						}, function(err) {
							return callback(err);
						});						
					}
				});
			});
		});
	};
	
	cronconfig.sendpurchasemail = function (logger, config, models,callback) {
		var nodemailer = require("nodemailer");
		
		var smtpTransport = nodemailer.createTransport("SMTP",{
			service: "Gmail",
			auth: {
				user: "info@ternopel.com",
				pass: config.app_smtp_password
			}
		});		
		
		models.transactionsheader.find({mail_sent:false},function(err,transactions) {
			if(err) {
				return callback(err);
			}
			
			var async	= require('async');
			var url		= "https://"+config.app_proxy_host;
			if(config.app_proxy_port!==443) {
				url	+=":"+config.app_proxy_port;
			}
			logger.info('Iterating transactions:'+config.app_target_mail);
			async.each(transactions, function(transaction, mycallback) {
				
				transaction.getUser(function(err,user) {
					if(err) {
						return callback(err);
					}
					logger.info('Sending mail to:'+user.email_address);
					smtpTransport.sendMail({
						from: "Información Papelera Ternopel <info@ternopel.com>",
						to: "<"+config.app_target_mail+">", 
						subject: "Nuevo incauto ✔", 
						html: "Amor, acaban de hacer un pedido en el carrito de compras ! La compra fue:"+transaction.total_purchase+" y el comprador fue:"+user.email_address
					}, function(error, response){
						if(error){
							return mycallback(error);
						}
						else{
							logger.info("Message sent: " + response.message);
							transaction.mail_sent		= true;
							transaction.save(function(err) {
								return mycallback(err);
							});
						}
					});
				});
				
			}, function(err) {
				return callback(err);
			});
		});
	};
	
	cronconfig.contactmessage = function (logger, config, models,callback) {
		var nodemailer = require("nodemailer");
		
		var smtpTransport = nodemailer.createTransport("SMTP",{
			service: "Gmail",
			auth: {
				user: "info@ternopel.com",
				pass: config.app_smtp_password
			}
		});		
		
		models.contact.find({sent:false},function(err,messages) {
			if(err) {
				return callback(err);
			}
			
			var async	= require('async');
			var url		= "https://"+config.app_proxy_host;
			if(config.app_proxy_port!==443) {
				url	+=":"+config.app_proxy_port;
			}
			logger.info('Iterating contacts sent:'+config.app_target_mail);
			async.each(messages, function(message, mycallback) {
				
				var html="Amor, acaban de mandar un mensaje pidiendo información ...<br>";
				html+="Email: "+message.email_address+"<br>";
				html+="Apellido: "+message.last_name+"<br>";
				html+="Nombre: "+message.first_name+"<br>";
				html+="Consulta: "+message.comments+"<br>";
				
				smtpTransport.sendMail({
					from: "Información Papelera Ternopel <info@ternopel.com>",
					to: "<"+config.app_target_mail+">", 
					subject: "Nueva consulta de "+message.email_address+" ✔", 
					html: html
				}, function(error, response){
					if(error){
						return mycallback(error);
					}
					else{
						logger.info("Message sent: " + response.message);
						message.sent		= true;
						message.save(function(err) {
							return mycallback(err);
						});
					}
				});
				
			}, function(err) {
				return callback(err);
			});
		});
	};
	
	cronconfig.init = function (logger, config, models, db) {
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
			var PurchaseJob = new CronJob('20 * * * * *', function() {
				logger.info('You will see this message every minute');
				cronconfig.sendpurchasemail(logger,config,models,function(err) {
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
			var ContactJob = new CronJob('40 * * * * *', function() {
				logger.info('You will see this message every minute');
				cronconfig.contactmessage(logger,config,models,function(err) {
					if(err) {
						logger.error(err);
					}
					logger.info("Cron runned successfully");
				});
			}, null, true, 'America/Buenos_Aires');
			var PriceListJob = new CronJob('0 0 0 * * 4', function() {
				logger.warn('You will see this message every tuesday');
				cronconfig.sendpricereportsmail(logger,config,models,db,{verified:true},function(err) {
					if(err) {
						logger.error(err);
					}
					logger.info("Cron runned successfully");
				});
			}, null, true, 'America/Buenos_Aires');
			
			
		}
	};
	
	
	
	
})(module.exports);
