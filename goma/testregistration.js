'use strict';

var request		= require('supertest'),
	logger		= require(__dirname+'/../utils/logger');

(function (testsregistration) {

	testsregistration.registerNewUser = function (done) {
		
		logger.info('Defining data to post');
		
		logger.info('Executing get to server');
		request("http://localhost:3000")
			.get('/registration')
			.end(function(err, res){
				
				var cheerio = require('cheerio');
				var $ = cheerio.load(res.text);
				var csrf = $('input[name=_csrf]').val();
				logger.info('csrf:'+csrf);

				logger.info('Posting info to server');
				request("http://localhost:3000")
					.post('/registration')
					.set('cookie', res.headers['set-cookie'])
					.send({
						'first_name' : 'Nicasio',
						'last_name' : 'Oronio',
						'email_address' : 'nicasio@gmail.com',
						'password' : 'nicasio',
						'confirm_password' : 'nicasio',
						'_csrf' : csrf,
						'is_registration': true
					})
					.expect(function(res){
						assert.equal(undefined, res.body.name);
						assert.equal('You must provide a valid email address', res.body.email);
						assert.equal('You must provide a message', res.body.message);
					})
					.expect(500, done);
//					.end(function(err,res) {
//						logger.info('Error:'+err);
//						done(err);
//					});
			});
	};

})(module.exports);
