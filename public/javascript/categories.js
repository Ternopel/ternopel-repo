$(function () {
	$("td").dblclick(function () {
		
		var tdname		=$(this).attr('name');
		var trid		=$(this).parent().attr('name');
		if(tdname != 'id') {
			var OriginalContent = $(this).text();
	 
			$(this).addClass("cellEditing");
			$(this).html("<input type='text' value='"+OriginalContent+"' />");
			$(this).children().first().focus();
	 
			$(this).children().first().keypress(function (e) {
				if (e.which == 13) {
					var newvalue = $(this).val();
					$(this).parent().text(newvalue);
					$(this).parent().removeClass("cellEditing");
					
					console.log('Id:'+trid+' column name:'+tdname+' value:'+newvalue);
					var formdata={id:trid, colname:tdname, value:newvalue};
					console.log('Data to send:'+JSON.stringify(formdata));
					
					$.ajax({
							url : '/registration',
							type : 'POST',
							data : formdata,
							success : function (response) {
								if ('success'===response) {
									alert('success');
								} 
								else {
									alert('error');
								}
							}
					});					
				}
			});
	 
			$(this).children().first().blur(function(){
				$(this).parent().text(OriginalContent);
				$(this).parent().removeClass("cellEditing");
			});
		}
	});
});

