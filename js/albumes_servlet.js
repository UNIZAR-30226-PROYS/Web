$(document).ready(function(){var elem_por_pagina=20;var url_string=window.location.href;var url=new URL(url_string);var pag_actual=url.searchParams.get("pagina");var inicio;document.title="Álbumes";$("#form_mostrar_albumes").submit(function(event){event.preventDefault();var post_url=$(this).attr("action");var form_data=$(this).serialize();var request_method=$(this).attr("method");$.ajax({url:post_url,type:request_method,data:form_data,}).done(function(response){var obj=JSON.parse(response);if(obj.error!=undefined){if(obj.error.indexOf("Usuario no logeado")>=0){cerrarSesion()}}
else{var lista_albumes=JSON.stringify(response);sessionStorage.setItem("lista_albumes",lista_albumes);var albumes=obj.albums;if(pag_actual==null){pag_actual=1}
else{pag_actual=parseInt(pag_actual)}
inicio=(pag_actual-1)*elem_por_pagina;for(i=inicio;i<(elem_por_pagina+inicio)&&i<albumes.length;i++){var album=albumes[i].nombre;var artista=albumes[i].artista;var image_aux=albumes[i].ruta_imagen;var indexi=image_aux.indexOf("/ps");var image=".."+image_aux.substr(indexi);var large='<li id="barraopciones"> <div class="cancioninf"><a href="album.html'+"?album="+album+'&artista='+artista+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion" onerror="this.src=\'img/Unknown_Album.png\'"></div><div class="nombrecancion">'+album+'</div></a></div></li>';$("#lista_albumes").append(large)}
if((elem_por_pagina+inicio)<albumes.length){var pagina_sig=pag_actual+1;var boton_mas='<br><br><form action="albumes.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';$(".informacion").append(boton_mas)}}}).fail(function(response){alert("Error interno. Inténtelo más tarde.")})});$("#form_mostrar_albumes").submit();$("#form_buscar_album").submit(function(event){event.preventDefault();var valor_busqueda=document.getElementById("form_buscar_album").elements[0].value;var valor_sin_espacioizquierdo=$.trim(valor_busqueda);document.getElementById("search_album").value=valor_sin_espacioizquierdo;if(valor_sin_espacioizquierdo==""){return!1}
var post_url=$(this).attr("action");var form_data=$(this).serialize();var request_method=$(this).attr("method");$.ajax({url:post_url,type:request_method,data:form_data,}).done(function(response){var obj=JSON.parse(response);var lista_albumes=JSON.stringify(response);if(obj.error!=undefined){if(obj.error.indexOf("Usuario no logeado")>=0){cerrarSesion()}
else if(obj.error.indexOf("album cuyo nombre sea o empiece")>=0){sessionStorage.setItem("lista_albumes",lista_albumes);window.location="busqueda_albumes.html?busqueda_album="+valor_sin_espacioizquierdo+"&pagina=1"}
else{alert("Error. Inténtelo más tarde.")}}
else{sessionStorage.setItem("lista_albumes",lista_albumes);window.location="busqueda_albumes.html?busqueda_album="+valor_sin_espacioizquierdo+"&pagina=1"}}).fail(function(response){alert("Error interno. Inténtelo más tarde.")})})})
