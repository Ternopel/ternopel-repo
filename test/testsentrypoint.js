'use strict';

var app			= require(__dirname+'/../app.js'),
	logger		= require(__dirname+'/../utils/logger'),
	config		= require(__dirname+'/../utils/config')(),
	liquibase	= require(__dirname+'/../utils/liquibase');

var request		= require('supertest'),
	server,
	db;

var testsregistration		= require(__dirname+'/../goma/testregistration');

describe('Users creation', function() {
	
	this.timeout(0);

	before(function(done) {
		
		config.app_run_liquibase	= 'false';
		config.db_database			= config.test_db_database;
		config.db_show_sql			= config.test_db_show_sql;
		config.db_liquibase_xml		= config.test_db_liquibase_xml;
		
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
		logger.info('---------------- Starting test -----------------');
		logger.info("Dropping model");
		db.drop(function(err) {
			if(err) {
				return done(err);
			}
			db.driver.execQuery('drop table databasechangelog', function(err,data) {
				logger.info("Creating model");
				db.sync(function(err) {
					config.app_run_liquibase	= 'true';
					logger.info("Running liquibase");
					liquibase.init(logger,config);
					return done(err);
				});
			});
			
			
		});
	});	
	
 	it('Users registration and login OK', testsregistration.registerNewUser);
 	it('Users registration with fields required errors', testsregistration.registerNewUserFieldsRequired);
 	it('Users login with invalid username/password', testsregistration.loginInvalidUsernamePassword);
 	it('Register existing user', testsregistration.registerExistingUser);
 	it('Admin login', testsregistration.adminLogin);
 	
	after(function (){
		logger.info('Stopping server');
		server.close();
	});
});
