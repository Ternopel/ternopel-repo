'use strict';

var app			= require(__dirname+'/../app.js'),
	logger		= require(__dirname+'/../utils/logger')(module),
	config		= require(__dirname+'/../utils/config')(),
	liquibase	= require(__dirname+'/../utils/liquibase');

var request		= require('supertest'),
	server, 
	db;

var testsregistration		= require(__dirname+'/../goma/testregistration');
var testreport				= require(__dirname+'/../goma/testreport');
var testhealth				= require(__dirname+'/../goma/testhealth');
var testshome				= require(__dirname+'/../goma/testshome');
var testscategories			= require(__dirname+'/../goma/testscategories');
var testsproducts			= require(__dirname+'/../goma/testsproducts');
var testsproductsformats	= require(__dirname+'/../goma/testsproductsformats');
var testsproductspictures	= require(__dirname+'/../goma/testsproductspictures');
var testsposters			= require(__dirname+'/../goma/testsposters');
var testsendemail			= require(__dirname+'/../goma/testssendemail');
var testprivacy				= require(__dirname+'/../goma/testprivacy');
var testshoppingcart		= require(__dirname+'/../goma/testshoppingcart');
var testscontact			= require(__dirname+'/../goma/testcontact');
var testelastic				= require(__dirname+'/../goma/testelastic');
var testredis				= require(__dirname+'/../goma/testredis');

describe('Test Suite', function() {
	
	this.timeout(0);

	before(function(done) {
		
		config.app_run_liquibase			= 'false';
		config.app_cron						= 'false';
		config.app_port						= config.test_app_port;
		config.db_database					= config.test_db_database;
		config.db_show_sql					= config.test_db_show_sql;
		config.db_liquibase_xml				= config.test_db_liquibase_xml;
		config.app_products_imgs_dir		= config.test_app_products_imgs_dir;
		config.app_posters_imgs_dir			= config.test_app_posters_imgs_dir;
		config.app_target_mail				= config.test_app_target_mail;
		config.app_secured_cookies			= config.test_app_secured_cookies;
		config.app_elastic_host				= config.test_app_elastic_host;
		config.app_elastic_index			= config.test_app_elastic_index;
		config.app_redis_host				= config.test_app_redis_host;
		config.app_redis_port				= config.test_app_redis_port;
		config.app_redis_namespace			= config.test_app_redis_namespace;
		config.app_show_chat				= config.test_app_show_chat;
		
		logger.info("Initiating app");
		app.init(config, function(app,pdb,models) {
			db		= pdb;
			
			testsendemail.setMailInfo(models,pdb,config);
			
			server	= app.listen(config.test_app_port, function() {
				logger.info('Listening on port:'+server.address().port);
				return done();
			});
		});
	});
	
	beforeEach(function(done) {
		logger.info('---------------- Starting test -----------------');
		logger.info("Dropping model");
		db.driver.execQuery("DROP VIEW if exists plain_info",function(err,data) {
			if(err) {
				return done(err);
			}
			
			db.drop(function(err) {
				if(err) {
					return done(err);
				}
				db.driver.execQuery('drop table databasechangelog', function(err,data) {
					logger.info("Creating model");
					db.sync(function(err) {
						config.app_run_liquibase	= 'true';
						logger.info("Running liquibase");
						liquibase.init(config);
						return done(err);
					});
				});
			});
		});
	});	

	var runTests=true;
	
	if(runTests) {
		it('Get Contact Unlogged in', testscontact.getContactUnloggedIn);
		it('Get Contact Logged in', testscontact.getContactLoggedIn);
	}
	
	if(runTests) {
		it('Get Shopping Cart Logged in', testshoppingcart.getShoppingCartLoggedIn);
		it('Get Shopping Cart Unlogged in', testshoppingcart.getShoppingCartUnloggedIn);
		it('Get Price Calculation', testshoppingcart.getPriceCalculation);
		it('Add product to cart', testshoppingcart.addProductToCart);
		it('Delete Product of cart', testshoppingcart.deleteShoppingCart);
		it('Purchase With Registration', testshoppingcart.purchaseWithRegistration);
		it('Purchase With Login', testshoppingcart.purchaseWithLogin);
		it('Purchase Logged In', testshoppingcart.purchaseLoggedIn);
	}
	
	if(runTests) {
		it('Send registration email', testsendemail.sendRegistrationMail);
		it('Send mailing email', testsendemail.sendMailingmails);
		it('Send purchase email', testsendemail.sendPurchaseMail);
		it('Send contact email', testsendemail.sendContactMessage);
		it('Send price reports email', testsendemail.sendPriceReportsMail);
		it('Send price immediate email', testsendemail.sendPriceImmediateMail);
	}
	
	if(runTests) {
		it('Create poster', testsposters.createPoster);
	}
	
	// admin products pictures tests
	if(runTests) {
		it('Create product picture', testsproductspictures.createProductPicture);
	}
	
	// admin products formats tests
	if(runTests) {
		it('Get product format', testsproductsformats.getProductFormat);
		it('Delete product format', testsproductsformats.deleteProductFormat);
		it('Update product format', testsproductsformats.updateProductFormat);
		it('Create product format', testsproductsformats.createProductFormat);
	}	
	
	// admin products tests
	if(runTests) {
		it('Update Admin products', testsproducts.updateAdminProduct);
		it('Update product', testsproducts.updateProduct);
		it('Get products', testsproducts.getProducts);
		it('Get products formats', testsproducts.getProductFormats);
		it('Get Admin products', testsproducts.getAdminProducts);
		it('Get products picture', testsproducts.getProductPicture);
		it('Add products picture', testsproducts.addProductPicture);
		it('Delete product', testsproducts.deleteProduct);
		it('Create product', testsproducts.createProduct);
	}	
	
	// admin categories tests
	if(runTests) {
		it('Get categories', testscategories.getCategories);
		it('Create category', testscategories.createCategory);
		it('Delete category', testscategories.deleteCategory);
		it('Update category', testscategories.updateCategory);
	}	
	
	// home tests
	if(runTests) {
		it('Get Offers', testshome.getOffers);
		it('Get No Posters', testshome.getNoPosters);
		it('Get category', testshome.getCategory);
		it('Get product admin user', testshome.getProductAdminUser);
		it('Get product', testshome.getProduct);
		it('Get no existing category', testshome.getNoExistingCategory);
		it('Get no existing product', testshome.getNoExistingProduct);
		it('Get Search', testshome.getSearch);
	}
	
	// Registration tests
	if(runTests) {
		it('Register new mailing user', testsregistration.registerNewMailingUser);
		it('Client login', testsregistration.clientLogin);
		it('Users registration with fields required errors', testsregistration.registerNewUserFieldsRequired);
		it('Users registration ', testsregistration.registerNewUser);
		it('Admin login', testsregistration.adminLogin);
		it('Users login with invalid username/password', testsregistration.loginInvalidUsernamePassword);
		it('Admin with no permissions', testsregistration.adminWithNoPermissions);
		it('Confirm User', testsregistration.confirmUser);
		it('List delivery', testsregistration.listDelivery);
	}
	 	
 	// Health check
	if(runTests) {
		it('Health check', testhealth.getHealth);
	}
	if(runTests) {
		it('Elastic search reindex', testelastic.getReindex);
		it('Elastic suggestions', testelastic.getSuggestions);
	}
	
	if(runTests) {
		it('Redis upload sessions', testredis.uploadSessions);
	}
	
	if(runTests) {
		it('Privacy', testprivacy.getPrivacy);
	}
 	
 	// Report test
	if(runTests) {
		require('jsreport').bootstrapper({ httpPort: 4000 }).start();
		it('Report JPG', testreport.getReportJPG);
		it('Report PDF', testreport.getReportPDF);
	}

 	after(function (){
		logger.info('Stopping server');
		server.close();
	});
});
