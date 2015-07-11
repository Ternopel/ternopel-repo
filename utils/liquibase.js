'use strict';

(function (liquibase) {

	liquibase.init = function (logger,config) {

		if(config.app_run_liquibase==='false') {
			logger.warn("Not running liquibase");
			return;
		}
		
		logger.debug('Before creation child_process');
		var path	= require('path'),
			exec	= require('child_process').execFileSync;
		
		var liqdir	= path.dirname(module.parent.filename) + '/support/liquibase';
		logger.debug('liqdir:'+liqdir);
		var args	= [	'-jar',
						liqdir + '/liquibase-core-2.0.3.jar',
						'--classpath='+liqdir+'/postgresql-9.3-1101-jdbc4.jar',
						'--driver=org.postgresql.Driver',
						'--changeLogFile='+liqdir+'/'+config.db_liquibase_xml,
						'--url=jdbc:postgresql://'+config.db_host+':'+config.db_port+'/'+config.db_database+'?charSet=UTF-8',
						'--username='+config.db_user,
						'--password='+config.db_password,
						'update'
					];
		
		logger.debug('Executing task:'+args);
		var output = exec('java',args).toString();
		logger.info(output);
	};
	
})(module.exports);
