// Add category
$(function () {
	$("#addCategory").click(function () {
		var csrf	=$("input[name='_csrf']").val();
		var formdata={_csrf:csrf};
		$.ajax({
			url : '/admin/categories',
			type : 'PUT',
			data : formdata,
			success : function (category) {
				console.log(category);
				window.location.href	= '/admin/categories';
			},
			error : function(errorresponse) {
				show_error_messages(errorresponse);
			}
		});
	});
});

// Remove category
$(function () {
	$("td input[type='button']").click(function () {
		var tr			=$(this).parent().parent();
		var trid		=tr.attr('name');
		var csrf		=$("input[name='_csrf']").val();	
		
		console.log('Id:'+trid);
		var formdata={id:trid, _csrf:csrf};
		console.log('Data to send:'+JSON.stringify(formdata));
		clear_notification_toolbar();
		
		$.ajax({
			url : '/admin/categories',
			type : 'DELETE',
			data : formdata,
			success : function (successresponse) {
				tr.remove();
			},
			error : function(errorresponse) {
				show_error_messages(errorresponse);
			}
		});
	});
});

