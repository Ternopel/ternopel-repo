'use strict';

var utils	= require('./utils'),
	ld		= require('lodash'),
	logger	= require("../../utils/logger")(module);

module.exports = {
	get_contact: function(req, res, next) {
		logger.info("Getting Contact page");
		var pageinfo = ld.merge(req.pageinfo, { csrfToken: req.csrfToken() });
		res.render('contact.html',pageinfo);
	},
	
	post_contact: function(req, res, next) {

		var pageinfo		= req.pageinfo;
		var comments		= req.body.comments;
		var email_address;
		var first_name;
		var last_name;
		logger.debug('User trying to register:'+req.body.email_address);
		
		logger.debug("Defining validators");
		if(pageinfo.is_logged_in===false) {
			req.assert('email_address', 'El email ingresado es incorrecto').isEmail();
			req.assert('first_name', 'Nombre es requerido').notEmpty();
			req.assert('last_name', 'Apellido es requerido').notEmpty();
			email_address	= req.body.email_address;
			first_name		= req.body.first_name;
			last_name		= req.body.last_name;
		}
		else {
			email_address	= pageinfo.email_address;
			first_name		= pageinfo.first_name;
			last_name		= pageinfo.last_name;
		}
			
		req.assert('comments', 'Su consulta es requerida').notEmpty();

		logger.info("Executing validation");
		var valerrors = req.validationErrors();
		if(valerrors) {
			return utils.send_ajax_validation_errors(req,res,valerrors);
		}

		var contact = {email_address: email_address, first_name:first_name, last_name: last_name, comments: comments};
		req.models.contact.create(contact,function(err,contact) {
			if(err) {
				return utils.send_ajax_error(req,res,err);
			}
			return res.status(200).send('success');
		});
	}
	
};
