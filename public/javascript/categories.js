$(function () {
	$("td").dblclick(function () {
		
		var tdname		=$(this).attr('name');
		var trid		=$(this).parent().attr('name');
		var csrf		=$("input[name='_csrf']").val();		
		
		if(tdname != 'id') {
			var OriginalContent = $(this).text();
	 
			$(this).addClass("cellEditing");
			$(this).html("<input type='text' value='"+OriginalContent+"' style='width:400px;'/>");
			$(this).children().first().focus();
	 
			$(this).children().first().keypress(function (e) {
				if (e.which == 13) {
					clear_notification_toolbar();
					var field		=$(this);
					var newvalue	=field.val();
					
					console.log('Id:'+trid+' column name:'+tdname+' value:'+newvalue);
					var formdata={id:trid, colname:tdname, value:newvalue, _csrf:csrf};
					console.log('Data to send:'+JSON.stringify(formdata));
					
					$.ajax({
						url : '/admin/categories',
						type : 'POST',
						data : formdata,
						success : function (response) {
							if ('success'===response) {
								console.log('Asigning new value');
								field.parent().text(newvalue);
								console.log('Change style');
								field.parent().removeClass("cellEditing");
							} 
							else {
								show_error_messages(response);
							}
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

