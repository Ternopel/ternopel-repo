var app			= require('E:/Zintro/workspaces/ternopel/ternopel-repo/app.js'),
	logger		= require("E:/Zintro/workspaces/ternopel/ternopel-repo/utils/logger"),
	config		= require("E:/Zintro/workspaces/ternopel/ternopel-repo/utils/config")();

var request		= require('supertest'),
	soda		= require('soda'),
	assert		= require('assert'),
	expect		= require('expect'),
	browser;

describe('Expert sign up test1', function(){
	this.timeout(0);

	before(function(done) {
		
		config.app_run_liquibase	= false;
		config.db_database			= config.test_db_datatabase;
		
		var appref = app.init(logger,config);
		
		logger.info("Starting TEST server");
		var server = appref.listen(3000, function() {
			logger.info('Listening on port:'+server.address().port);
		});

		
//		browser = soda.createClient({
//			host: 'localhost',
//			port: 4444,
//			url: 'http://localhost:3000',
//			browser: 'googlechrome'
//		});
//		done();
	});

 	it('Sign up with existing email', function(done) {
 		console.log("EN TEST1");
 		
 		browser
			.chain
			.session()
			.open('/')
			.clickAndWait('register')
			.type('email_address', 'natalita4@gmail.com')
			.type('password', 'natalita')
			.clickAndWait('submit')
			.assertTextPresent('Bienvenido, natalita4@gmail.com')
			.clickAndWait('logout')
			.end(function(err){
				browser.testComplete(
					function() {
						console.log('done');
						return done(err);
					});
			}); 		
 		
	});

 	it('Sign up with noexisting email', function(done) {

 		console.log("EN TEST2");
 		browser
		.chain
		.session()
		.open('/')
		.clickAndWait('register')
		.type('email_address', 'natalita3@gmail.com')
		.type('password', 'natalita')
		.clickAndWait('submit')
		.assertTextPresent('Bienvenido, natalita3@gmail.com')
		.clickAndWait('logout')
		.end(function(err){
			browser.testComplete(
				function() {
					console.log('done');
					return done(err);
				});
		}); 		
 		
 		
 		return done();
 	});
 	
	after(function (){
		console.log('Stopping');
	});
});
