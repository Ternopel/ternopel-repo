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
	
	cipher.decrypt = function (text) {
		var decipher	= crypto.createDecipher(algorithm,password);
		var decrypted	= decipher.update(text,'hex','utf8');
		decrypted		+= decipher.final('utf8');
		return decrypted; 
	};
	
})(module.exports);
