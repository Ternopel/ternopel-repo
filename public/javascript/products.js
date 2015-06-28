// Enter on search field
$(function () {
	var input=$("input[name='search']");
	input.keypress(function (e) {	
		if (e.which == 13) {
			window.location.href = '/admin/products?search='+input.val();
		}
	});
});

// See formats
$(function () {
	var input=$("input[name='formatscheck']");
	input.click(function (e) {	
		var check		=$(this);
		var trid		=$(this).parent().parent().attr('name');
		var formatstr	=$('tr[name='+trid+'_format]');
		if(check.is(':checked')) {
			formatstr.show();
		}
		else {
			formatstr.hide();
		}
	});
});


$(function () {
	$("td select").change(function () {

		var tdname		=$(this).parent().attr('name');
		var trid		=$(this).parent().parent().attr('name');
		var csrf		=$("input[name='_csrf']").val();
		var urltopost	=$(this).parent().parent().parent().parent().attr('summary');

		var field		=$(this);
		var newvalue	=field.val();
		
		console.log('Id:'+trid+' column name:'+tdname+' value:'+newvalue);
		var formdata={id:trid, colname:tdname, colvalue:newvalue, _csrf:csrf};
		console.log('Data to send:'+JSON.stringify(formdata));
		
		$.ajax({
			url : urltopost,
			type : 'POST',
			data : formdata,
			success : function (successresponse) {
				console.log('Success');
			},
			error : function(errorresponse) {
				show_error_messages(errorresponse);
			}
		});
	});
});




