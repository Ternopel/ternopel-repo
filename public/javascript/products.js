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

