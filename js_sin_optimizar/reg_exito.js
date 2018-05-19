$(document).ready(function() {

	$('.button1').click(function() {

		type = $(this).attr('data-type');

		$('.overlay-container1').fadeIn(function() {

			window.setTimeout(function(){
				$('.window-container1.'+type).addClass('window-container1-visible');
			}, 100);

		});
	});

	$('.close1').click(function() {
		$('.overlay-container1').fadeOut().end().find('.window-container1').removeClass('window-container1-visible');
		location.reload();
	});

});
