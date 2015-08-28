'use strict';

(function (cipher) {
	
	var	crypto		= require('crypto'),
		algorithm	= 'aes-256-ctr',
		password	= 'natalitaypilarcita'; 
	
	cipher.encrypt = function (text) {
		var cipher	= crypto.createCipher(algorithm,password);
		var crypted	= cipher.update(text,'utf8','hex');
		crypted		+= cipher.final('hex');
		return crypted; 		
	};
	
})(module.exports);
