$(document).ready(function() {

	$('.button0').click(function() {

		type = $(this).attr('data-type');

		$('.overlay-container0').fadeIn(function() {

			window.setTimeout(function(){
				$('.window-container0.'+type).addClass('window-container0-visible');
			}, 100);

		});
	});

	$('.close0').click(function() {
		$('.overlay-container0').fadeOut().end().find('.window-container0').removeClass('window-container0-visible');
	});

});
