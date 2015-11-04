$(function() {
	console.log($('.slider-container ul').children().size());
	if($('.slider-container ul').children().size()>0) {
		$('.slider-container ul').anoSlide({
			items: 1,
			speed: 500,
			lazy: true,
			auto: 4000,
			onStart: function(ui) {
				var index = ui.index;
				$('.slider-btns li a').removeClass();
				$('.slider-btns li:eq( '+index+' ) a').addClass('active-slide');
			}
		});
	}
});