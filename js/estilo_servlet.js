$(document).ready(function(){var url_string=window.location.href;var url=new URL(url_string);var inicio;var c=url.searchParams.get("estilo");if(c==undefined){window.location="home.html"}
$("#texto_nombre_busqueda").append(c);document.title="Estilo "+c;document.getElementById('genero').value=c;$("#form_mostrar_estilo").submit(function(event){event.preventDefault();var post_url=$(this).attr("action");var form_data=$(this).serialize();var request_method=$(this).attr("method");$.ajax({url:post_url,type:request_method,data:form_data,}).done(function(response){var obj=JSON.parse(response);if(obj.error!=undefined){if(obj.error.indexOf("Usuario no logeado")>=0){cerrarSesion()}}
else if(obj.NoHayCanciones!=undefined){$("#titulopagina").after("<h2 id=\"sin_resul\">No hay canciones.</h2>")}
else{cargar_lista_favoritos().done(function(response){var obj1=JSON.parse(response);var favoritos=undefined;if(obj1.error!=undefined){if(obj1.error.indexOf("Usuario no logeado en el servidor")>=0){borrarCookie("login");borrarCookie("idSesion");window.location="inicio.html"}}
else if(obj1.NoHayCanciones!=undefined){}
else{var aux=obj1.canciones;if(aux.length>0){for(i in aux){delete aux[i].uploader}
favoritos=JSON.stringify(aux)}}
mostrarPaginaconFav(obj,favoritos,"estilo","estilo")}).fail(function(response){alert("Error interno. Inténtelo más tarde.")})}}).fail(function(response){alert("Error interno. Inténtelo más tarde.")})});$("#form_mostrar_estilo").submit()})
