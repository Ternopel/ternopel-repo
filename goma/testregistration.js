'use strict';

var request		= require('supertest'),
	logger		= require(__dirname+'/../utils/logger');

(function (testsregistration) {

	testsregistration.registerNewUser = function (done) {
		
		logger.info('Defining data to post');
		var post_data = {
 			'first_name' : 'Nicasio',
 			'last_name' : 'Oronio',
 			'email_address' : 'nicasio@gmail.com',
 			'password' : 'nicasio',
 			'confirm_password' : 'nicasio'
 		};
		
		logger.info('Executing get to server');
		request("http://localhost:3000")
			.get('/registration')
			.end(function(err, res){
				
				var cheerio = require('cheerio');
				var $ = cheerio.load(res.text);
				var xx = $('input[name=_csrf]').val();
				console.log(xx);

				done();
			});
	};

})(module.exports);
