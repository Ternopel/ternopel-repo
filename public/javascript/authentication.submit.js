$(document).ready(function(){
	var email_address,password;
	$("#submit").click(function(){
		email_address	=$("#email_address").val();
		password		=$("#password").val();
		alert(email_address);
		$.post('/authentication',{email_address: email_address,password: password}, function(data){
			if(data==='done') {
				alert('login success');
			}
		});
	});
});
