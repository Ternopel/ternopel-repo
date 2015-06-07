//var ser = require('E:/Zintro/workspaces/ternopel/ternopel-repo/app.js');
var request = require('supertest');
var expect = require('expect');

//var server = new ser();

describe('Expert sign up test', function(){
	this.timeout(0);

	before(function(done) {
		console.log('Starting');
		done();
	});

 	it('Sign up with existing email', function(done) {
 		console.log("EN TEST1");
 		return done();
	});

 	it('Sign up with noexisting email', function(done) {
 		console.log("EN TEST2");
 		return done();
 	});
 	
	after(function (){
		console.log('Stopping');
	});
});
