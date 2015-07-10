"use strict";

function getcsrf(res) {
	var cheerio = require('cheerio');
	var $ = cheerio.load(res.text);
	var csrf = $('input[name=_csrf]').val();
	return csrf;
};

function getcookies(res) {
	var cookies = ''+res.headers['set-cookie'];
	cookies = cookies.replace('Path=/,','');
	return cookies;
};

exports.getcsrf		= getcsrf;
exports.getcookies	= getcookies;
