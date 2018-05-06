$(document).ready(function() {

	$('.button11').click(function() {

		type = $(this).attr('data-type');

		$('.overlay-container11').fadeIn(function() {

			window.setTimeout(function(){
				$('.window-container11.'+type).addClass('window-container11-visible');
			}, 100);

		});
	});

	$('.close11').click(function() {
		$('.overlay-container11').fadeOut().end().find('.window-container11').removeClass('window-container11-visible');
		//Eliminar para poder mostrar otras si se pulsa en otra Añadir lista
		$(".form_anadir_cancion_lista").remove();
	});

});
