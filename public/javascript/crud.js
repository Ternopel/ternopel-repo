$(function () {
	$("td span").dblclick(function () {
		
		var tdname		=$(this).parent().attr('name');
		var trid		=$(this).parent().parent().attr('name');
		var urltopost	=$(this).parent().parent().parent().attr('summary');
		var csrf		=$("input[name='_csrf']").val();
		var urltopost	=$(this).parent().parent().parent().parent().attr('summary');
		
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
					url : urltopost,
					type : 'POST',
					data : formdata,
					success : function (successresponse) {
							console.log('Asigning new value');
							field.parent().html("<span>"+newvalue+"</span>");
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
			$(this).parent().html("<span>"+OriginalContent+"</span>");
			$(this).parent().removeClass("cellEditing");
			clear_notification_toolbar();
		});
	});
	
});
