var app			= require(__dirname+'/../app.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+'/../utils/config')();

var request		= require('supertest'),
	soda		= require('soda'),
	assert		= require('assert'),
	expect		= require('expect'),
	browser,
	server;

describe('Users creation', function() {
	
	this.timeout(0);

	before(function(done) {
		
		config.app_run_liquibase	= 'false';
		config.db_database			= config.test_db_datatabase;
		
		
		var waterfall = require('async-waterfall');
		waterfall([ 
			function(callback) {
				logger.info("Initiating app");
				app.init(logger,config, function(app,db) {
					return callback(null,app,db);
				});
			}, 
			function(app,db,callback) {
				logger.info("Starting TEST listener");
				server = app.listen(config.test_app_port, function() {
					logger.info('Listening on port:'+server.address().port);
					return callback(null,db);
				});
			}, 
			function(db,callback) {
				logger.info("Dropping model");
				db.drop(function(err) {
					return callback(err,db);
				});
			}, 
			function(db,callback) {
				logger.info("Creating model");
				db.sync(function(err) {
					return callback(err);
				});
			},
			function(callback) {
				logger.info("Starting browser");
				browser = soda.createClient({
					host: 'localhost',
					port: 4444,
					url: 'http://localhost:'+config.test_app_port,
					browser: 'googlechrome'
				});
				return callback(null);
			}
		], 
		function(err, result) {
			done(err);
		});
	});

 	it('Create not existing user', function(done) {
 		console.log("EN TEST1");
 		
 		browser
			.chain
			.session()
			.open('/')
			.clickAndWait('register')
			.type('email_address', 'natalita@gmail.com')
			.type('password', 'natalita')
			.clickAndWait('submit')
			.assertTextPresent('Bienvenido, natalita@gmail.com')
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
		server.stop();
		browser.close();
	});
});
