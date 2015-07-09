'use strict';

var request		= require('supertest'),
	logger		= require(__dirname+'/../utils/logger');

(function (testsregistration) {

	testsregistration.registerNewUser = function (done) {
		
		logger.info('Executing get to server');
		request("http://localhost:3000")
			.get('/registration')
			.end(function(err, res){
				
				var cheerio = require('cheerio');
				var $ = cheerio.load(res.text);
				var csrf = $('input[name=_csrf]').val();
				logger.info('csrf:'+csrf);
				
				var cookies = ''+res.headers['set-cookie'];
				cookies = cookies.replace('Path=/,','');

				logger.info('Posting info to server');
				request("http://localhost:3000")
					.post('/registration')
					.set('cookie', cookies)
					.send({
						'first_name' : 'Nicasio',
						'last_name' : 'Oronio',
						'email_address' : 'nicasio@gmail.com',
						'password' : 'nicasio',
						'confirm_password' : 'nicasio',
						'_csrf' : csrf,
						'is_registration': 'true'
					})
					.expect(200)
					.end(function(err,res) {
						logger.info('Hola');
						done();
					});
			});
	};

	testsregistration.authenticateUser = function (done) {
		testsregistration.registerNewUser(function(subdone) {

		logger.info('Executing get to server');
		request("http://localhost:3000")
			.get('/registration')
			.end(function(err, res){
				
				var cheerio = require('cheerio');
				var $ = cheerio.load(res.text);
				var csrf = $('input[name=_csrf]').val();
				logger.info('csrf:'+csrf);
				
				var cookies = ''+res.headers['set-cookie'];
				cookies = cookies.replace('Path=/,','');

				logger.info('Posting info to server');
				request("http://localhost:3000")
					.post('/registration')
					.set('cookie', cookies)
					.send({
						'email_address' : 'nicasio@gmail.com',
						'password' : 'nicasio',
						'_csrf' : csrf,
						'is_registration': 'false'
					})
					.expect(200, done);
			});
		});
	};


})(module.exports);
