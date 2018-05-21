$(document).ready(function(){var elem_por_pagina=20;var url_string=window.location.href;var url=new URL(url_string);var pag_actual=url.searchParams.get("pagina");var inicio;document.title="Artistas";$("#form_mostrar_artistas").submit(function(event){event.preventDefault();var post_url=$(this).attr("action");var form_data=$(this).serialize();var request_method=$(this).attr("method");$.ajax({url:post_url,type:request_method,data:form_data,}).done(function(response){var obj=JSON.parse(response);if(obj.error!=undefined){if(obj.error.indexOf("Usuario no logeado")>=0){cerrarSesion()}}
else{var lista_artistas=JSON.stringify(response);sessionStorage.setItem("lista_artistas",lista_artistas);var artistas=obj.artistas;if(pag_actual==null){pag_actual=1}
else{pag_actual=parseInt(pag_actual)}
inicio=(pag_actual-1)*elem_por_pagina;for(i=inicio;i<(elem_por_pagina+inicio)&&i<artistas.length;i++){var artista=artistas[i].nombreArtista;var image_aux=artistas[i].ruta_imagen;var indexi=image_aux.indexOf("/ps");var image=".."+image_aux.substr(indexi);var large='<li id="barraopciones"> <div class="cancioninf"><a href="artista.html'+"?artista="+artista+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion" onerror="this.src=\'img/Unknown_Artist.png\'"></div><div class="nombrecancion">'+artista+'</div></a></div></li>';$("#lista_artistas").append(large)}
if((elem_por_pagina+inicio)<artistas.length){var pagina_sig=pag_actual+1;var boton_mas='<br><br><form action="artistas.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';$(".informacion").append(boton_mas)}}}).fail(function(response){alert("Error interno. Inténtelo más tarde.")})});$("#form_mostrar_artistas").submit();$("#form_buscar_artista").submit(function(event){event.preventDefault();var valor_busqueda=document.getElementById("form_buscar_artista").elements[0].value;var valor_sin_espacioizquierdo=$.trim(valor_busqueda);document.getElementById("search_artista").value=valor_sin_espacioizquierdo;if(valor_sin_espacioizquierdo==""){return!1}
var post_url=$(this).attr("action");var form_data=$(this).serialize();var request_method=$(this).attr("method");$.ajax({url:post_url,type:request_method,data:form_data,}).done(function(response){var obj=JSON.parse(response);var lista_artistas=JSON.stringify(response);if(obj.error!=undefined){if(obj.error.indexOf("Usuario no logeado")>=0){cerrarSesion()}
else if(obj.error.indexOf("artista cuyo nombre sea o empiece")>=0){sessionStorage.setItem("lista_usuarios",lista_usuarios);window.location="busqueda_artistas.html?busqueda_artista="+valor_sin_espacioizquierdo+"&pagina=1"}
else{alert("Error. Inténtelo más tarde.")}}
else{sessionStorage.setItem("lista_artistas",lista_artistas);window.location="busqueda_artistas.html?busqueda_artista="+valor_sin_espacioizquierdo+"&pagina=1"}}).fail(function(response){alert("Error interno. Inténtelo más tarde.")})})})
