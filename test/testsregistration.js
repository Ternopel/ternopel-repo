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
		if(!request) {
			logger.info('Request is not defined');
		}
		if(!(request.get)) {
			logger.info('get is not defined');
		}
		request.get('/registration');
		return done();
		
//				.expect(200)
//				.send(post_data)
//				.expect(200)
//				.end(function(err, res) {
//					handle_err(err, res, done, function() {
//						console.info(res.text);
//						expect(res.text).toNotBe('success');
//						return done();
//					})
//				});
	};

})(module.exports);
