$(document).ready(function() {

	$('.button10').click(function() {

		type = $(this).attr('data-type');

		$('.overlay-container10').fadeIn(function() {

			window.setTimeout(function(){
				$('.window-container10.'+type).addClass('window-container10-visible');
			}, 100);

		});
	});

	$('.close10').click(function() {
		$('.overlay-container10').fadeOut().end().find('.window-container10').removeClass('window-container10-visible');
		location.reload();
	});

});
