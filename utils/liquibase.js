(function (liquibase) {

	liquibase.init = function (logger) {

		logger.debug('Before creation child_process');
		var path	= require('path'),
			exec	= require('child_process').execFileSync;
		
		var liqdir	= path.dirname(module.parent.filename) + '/support/liquibase';
		logger.debug('liqdir:'+liqdir);
		var args	= [	
		        	   	'-jar',
		        	   	liqdir + '/liquibase-core-2.0.3.jar',
		        	   	'--classpath='+liqdir+'/postgresql-9.3-1101-jdbc4.jar',
		        	   	'--driver=org.postgresql.Driver',
		        	   	'--changeLogFile='+liqdir+'/liquibase.xml',
		        	   	'--url=jdbc:postgresql://localhost:5432/ternopel_test?charSet=UTF-8',
		        	   	'--username=postgres',
		        	   	'--password=Pilarcita1',
		        	   	'update'
		        	  ];
		logger.debug('args:'+args);
		
		if(!exec) {
			logger.error("Exec not found");
		}
		logger.debug('Executing task');
		var output = exec('java',args).toString();
		logger.info(output);
	};
	
})(module.exports);
