'use strict';

$(function () {
	$("td label").dblclick(function () {
		
		var tdname		=$(this).parent().attr('name');
		var trid		=$(this).parent().parent().attr('name');
		var csrf		=$("input[name='_csrf']").val();
		var urltopost	=$(this).parent().parent().parent().parent().attr('summary');
		var size		=parseInt($(this).width())-100; 
		console.log("TTUSIZE:"+size);
		
		var OriginalContent = $(this).text();
 
		$(this).addClass("cellEditing");
		$(this).html("<input type='text' value='"+OriginalContent+"' style='width:150px;' name='colvalue'/><div class='errorMsg' id='colvalue_error'></div>");
		$(this).children().first().focus();

		$(this).children().first().keypress(function (e) {
			if (e.which == 13) {
				clear_notification_toolbar();
				var field		=$(this);
				var newvalue	=field.val().trim();
				
				console.log('Id:'+trid+' column name:'+tdname+' value:'+newvalue);
				var formdata={id:trid, colname:tdname, colvalue:newvalue, _csrf:csrf};
				console.log('Data to send:'+JSON.stringify(formdata));
				
				$.ajax({
					url : urltopost,
					type : 'POST',
					data : formdata,
					success : function (successresponse) {
							console.log('Asigning new value');
							field.parent().html("<label style='background-color: lightgray;'>"+newvalue+"</label>");
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
			$(this).parent().html("<label style='background-color: lightgray;'>"+OriginalContent+"</label>");
			$(this).parent().removeClass("cellEditing");
			clear_notification_toolbar();
		});
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

$(function () {
	$("td input[type='checkbox']").change(function () {
		var tdname		=$(this).parent().attr('name');
		if(tdname=='show_picture') {
			console.log('Ignore show_picture crud event');
			return;
		}
		
		var trid		=$(this).parent().parent().attr('name');
		var csrf		=$("input[name='_csrf']").val();
		var urltopost	=$(this).parent().parent().parent().parent().attr('summary');

		var field		=$(this);
		var ischecked	=field.is(':checked');
		
		console.log('Id:'+trid+' column name:'+tdname+' value:'+ischecked);
		var formdata={id:trid, colname:tdname, colvalue:ischecked, _csrf:csrf};
		console.log('Data to send:'+JSON.stringify(formdata));
		
		$.ajax({
			url : urltopost,
			type : 'POST',
			data : formdata,
			success : function (successresponse) {
				console.log('Success');
				location.reload();
			},
			error : function(errorresponse) {
				show_error_messages(errorresponse);
			}
		});
	});
});

function add(url) {
	var csrf	=$("input[name='_csrf']").val();
	var formdata={_csrf:csrf};
	$.ajax({
		url : url,
		type : 'PUT',
		data : formdata,
		success : function (entity) {
			console.log(entity);
			window.location.reload(true);
		},
		error : function(errorresponse) {
			show_error_messages(errorresponse);
		}
	});
}

// Remove category
$(function () {
	$("td input[name='remove']").click(function () {
		var tr			=$(this).parent().parent();
		var trid		=tr.attr('name');
		var csrf		=$("input[name='_csrf']").val();	
		var urltopost	=$(this).parent().parent().parent().parent().attr('summary');
		
		console.log('Id:'+trid);
		var formdata={id:trid, _csrf:csrf};
		console.log('Data to send:'+JSON.stringify(formdata));
		clear_notification_toolbar();
		
		$.ajax({
			url : urltopost,
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

