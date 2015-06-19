$(function () {
	$("td").dblclick(function () {
		
		var tdname		=$(this).attr('name');
		var trid		=$(this).parent().attr('name');
		var csrf		=$("input[name='_csrf']").val();		
		
		if(tdname != 'id') {
			var OriginalContent = $(this).text();
	 
			$(this).addClass("cellEditing");
			$(this).html("<input type='text' value='"+OriginalContent+"' style='width:400px;' name='colvalue'/><div class='errorMsg' id='colvalue_error'></div>");
			$(this).children().first().focus();
	 
			$(this).children().first().keypress(function (e) {
				if (e.which == 13) {
					clear_notification_toolbar();
					var field		=$(this);
					var newvalue	=field.val();
					
					console.log('Id:'+trid+' column name:'+tdname+' value:'+newvalue);
					var formdata={id:trid, colname:tdname, colvalue:newvalue, _csrf:csrf};
					console.log('Data to send:'+JSON.stringify(formdata));
					
					$.ajax({
						url : '/admin/categories',
						type : 'POST',
						data : formdata,
						success : function (successresponse) {
								console.log('Asigning new value');
								field.parent().text(newvalue);
								console.log('Change style');
								field.parent().removeClass("cellEditing");
							},
						error : function(errorresponse) {
							show_error_messages(errorresponse);
						}
					});					
				}
			});
	 
			$(this).children().first().blur(function(){
				$(this).parent().text(OriginalContent);
				$(this).parent().removeClass("cellEditing");
				clear_notification_toolbar();
			});
		}
	});
	
});

$(function () {
	$("#addCategory").click(function () {
//		$('#categoriesTable tr:first').after('<tr><td>HOLA</td></tr>');
		var csrf	=$("input[name='_csrf']").val();
		var formdata={_csrf:csrf};
		$.ajax({
			url : '/admin/categories',
			type : 'PUT',
			data : formdata,
			success : function (response) {
				console.log(response);
			}
		});					
		
		
		
		
	});
});

