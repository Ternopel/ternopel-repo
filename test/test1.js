var app			= require(__dirname+'/../app.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+'/../utils/config')();

var request		= require('supertest'),
//	assert		= require('assert'),
//	expect		= require('expect'),
	server,
	db;

var test2		= require(__dirname+'/../test/test2');

describe('Users creation', function() {
	
	this.timeout(0);

	before(function(done) {
		
		config.app_run_liquibase	= 'false';
		config.db_database			= config.test_db_datatabase;
		config.db_show_sql			= config.test_db_show_sql;
		
		logger.info("Initiating app");
		app.init(logger,config, function(app,pdb) {
			db		= pdb;
			server	= app.listen(config.test_app_port, function() {
				logger.info('Listening on port:'+server.address().port);
				return done();
			});
		});
	});
	
	beforeEach(function(done) {
		logger.info("Dropping model");
		db.drop(function(err) {
			if(err) {
				return done(err);
			}
			logger.info("Creating model");
			db.sync(function(err) {
				return done(err);
			});
		});
	});	
	
 	it('Create not existing user', function(done) {
 		logger.info("EN TEST1");
 		return done();
	});

 	it('Sign up with noexisting email', function(done) {

 		logger.info("EN TEST2");
 		return done();
 	});
 	
 	it('Sign up with noexisting email', test2.init);
 	
	after(function (){
		logger.info('Stopping');
		server.close();
	});
});
