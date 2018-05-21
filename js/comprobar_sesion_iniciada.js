if(leerCookie("login")==null||leerCookie("idSesion")==null){window.location="inicio.html"}
function cerrarSesion(){borrarCookie("login");borrarCookie("idSesion");sessionStorage.clear();window.location="inicio.html"}
function playMusic(src,imagen,cancion,artista,album,uploader,genero){audio_core=$('#audio-player').attr('src',src)[0];document.getElementById('imagen_cancion_wrapper').src=imagen;document.getElementById('cancion_wrapper').innerHTML=cancion;var enlace="cancion.html?nombre="+cancion+"&artista="+artista+"&album="+album+'&genero='+genero+'&uploader='+uploader+'&ruta='+src+'&ruta_imagen='+imagen;document.getElementById('enlacecancion_wrapper').href=enlace;document.getElementById('imagen_cancion_wrapper').onclick=function(){setIndiceAndPlay(0,1)};document.getElementById('cancion_wrapper').onclick=function(){setIndiceAndPlay(0,1)};audio_core.play()}
function reloadMusic(){var src=document.getElementById("audio-player").src;audio_core=$('#audio-player').attr('src',src)[0]
audio_core.play()}
function reproducirCancion(pagina_cancion){var aux=sessionStorage.getItem("listaActual");if(aux==null){cargar_lista_top_semanal()}
else{var canciones=JSON.parse(aux);var i=sessionStorage.getItem("indiceLista");var cancion=canciones[i].tituloCancion;var artista=canciones[i].nombreArtista;var genero=canciones[i].genero;var album=canciones[i].nombreAlbum;var ruta_aux=canciones[i].ruta;var index=ruta_aux.indexOf("/ps");var ruta=".."+ruta_aux.substr(index);var uploader=canciones[i].uploader;avisarReproducirCancion(ruta_aux);var image_aux=canciones[i].ruta_imagen;var indexi=image_aux.indexOf("/ps");var image=".."+image_aux.substr(indexi);if(pagina_cancion==0){playMusic(ruta,image,cancion,artista,album,uploader,genero)}
else{sessionStorage.setItem("tiempo_cancion",0);window.location="cancion.html?nombre="+cancion+"&artista="+artista+"&album="+album+"&genero="+genero+"&uploader="+uploader+"&ruta="+ruta+"&ruta_imagen="+image}}}
function avisarReproducirCancion(ruta){var post_url="/ps/ReproducirCancion"
var request_method="post";var form_data="ruta="+ruta;$.ajax({url:post_url,type:request_method,data:form_data,}).done(function(response){}).fail(function(response){alert("Error interno. Inténtelo más tarde.")})}
function siguienteCancion(pagina_cancion){var canciones=JSON.parse(sessionStorage.getItem("listaActual"));var i=parseInt(sessionStorage.getItem("indiceLista"));var aleatorio=sessionStorage.getItem("valor_aleatorio");if(aleatorio!=null){if(aleatorio==1){i=getRandomInt(0,canciones.length)}
else{i=i+1;if(i==canciones.length){i=0}}}
else{i=i+1;if(i==canciones.length){i=0}}
sessionStorage.setItem("indiceLista",i);reproducirCancion(pagina_cancion)}
function anteriorCancion(pagina_cancion){var canciones=JSON.parse(sessionStorage.getItem("listaActual"));var i=parseInt(sessionStorage.getItem("indiceLista"));var aleatorio=sessionStorage.getItem("valor_aleatorio");if(aleatorio!=null){if(aleatorio==1){i=getRandomInt(0,canciones.length)}
else{i=i-1;if(i<0){i=canciones.length-1}}}
else{i=i-1;if(i<0){i=canciones.length-1}}
sessionStorage.setItem("indiceLista",i);reproducirCancion(pagina_cancion)}
function setIndiceAndPlay(indice,a_pagina_cancion){sessionStorage.setItem("indiceLista",indice);var listaActual=sessionStorage.getItem("listaActual");var listaAux=sessionStorage.getItem("listaAux");if(listaActual!=listaAux){sessionStorage.setItem("listaActual",listaAux)}
reproducirCancion(a_pagina_cancion)}
function setIndiceAndPlayRecientes(indice,a_pagina_cancion,recientes){sessionStorage.setItem("indiceLista",indice);var listaAux;if(recientes==1){listaAux=sessionStorage.getItem("listaRecientes")}
else{listaAux=sessionStorage.getItem("listaRecomendadas")}
var listaActual=sessionStorage.getItem("listaActual");if(listaActual!=listaAux){sessionStorage.setItem("listaActual",listaAux)}
reproducirCancion(a_pagina_cancion)}
function finCancion(){var url=window.location.href;var pagina_cancion=0;if(url.indexOf("cancion.html?")>=0){pagina_cancion=1}
window.setTimeout(function(){siguienteCancion(pagina_cancion)},100)}
function pulsadoAleatorio(){if(document.getElementById("valor_aleatorio").checked){sessionStorage.setItem("valor_aleatorio",1)}
else{sessionStorage.setItem("valor_aleatorio",0)}}
$(function(){$('#audio-player').mediaelementplayer({alwaysShowControls:!0,features:['playpause','progress','volume','duration'],audioVolume:'horizontal',iPadUseNativeControls:!0,iPhoneUseNativeControls:!0,AndroidUseNativeControls:!0,success:function(mediaElement,originalNode,instance){var tiempo_actual=sessionStorage.getItem("tiempo_cancion");if(tiempo_actual==undefined){tiempo_actual=0}
instance.setCurrentTime(tiempo_actual);function actualizar_tiempo_actual(){sessionStorage.setItem("tiempo_cancion",instance.getCurrentTime());setTimeout(actualizar_tiempo_actual,500)}
setTimeout(actualizar_tiempo_actual,500)}})});function getRandomInt(min,max){return Math.floor(Math.random()*(max-min))+min}
$(document).ready(function(){var valor_aleatorio=sessionStorage.getItem("valor_aleatorio");if(valor_aleatorio==null){valor_aleatorio=!1}
else{if(valor_aleatorio==0){valor_aleatorio=!1}
else{valor_aleatorio=!0}}
document.getElementById("valor_aleatorio").checked=valor_aleatorio;var url=window.location.href;var pagina_cancion=0;if(url.indexOf("cancion.html?")>=0){pagina_cancion=1}
else{reproducirCancion(pagina_cancion)}});function cargar_lista_top_semanal(){var post_url="/ps/TopSemanal"
var request_method="post";$.ajax({url:post_url,type:request_method,}).done(function(response){var obj=JSON.parse(response);if(obj.error!=undefined){if(obj.error.indexOf("Usuario no logeado")>=0){cerrarSesion()}}
else if(obj.NoHayCanciones!=undefined){alert("Top semanal no tiene canciones.")}
else{var aux=obj.canciones;if(aux.length>0){var canciones=JSON.stringify(aux);sessionStorage.setItem("listaActual",canciones);sessionStorage.setItem("indiceLista",0);var url=window.location.href;var pagina_cancion=0;if(url.indexOf("cancion.html?")>=0){pagina_cancion=1}
reproducirCancion(pagina_cancion)}
else{}}}).fail(function(response){alert("Error interno. Inténtelo más tarde.")})}
function form_repr_lista(){$(".form_reproducir_lista").submit(function(event){event.preventDefault();var post_url=$(this).attr("action");var form_data=$(this).serialize();var request_method=$(this).attr("method");$.ajax({url:post_url,type:request_method,data:form_data,}).done(function(response){var obj=JSON.parse(response);if(obj.error!=undefined){if(obj.error.indexOf("Usuario no logeado")>=0){cerrarSesion()}}
else if(obj.NoHayCanciones!=undefined){alert("La lista no tiene canciones.")}
else{var canciones=JSON.stringify(obj.canciones);sessionStorage.setItem("listaActual",canciones);sessionStorage.setItem("indiceLista",0);reproducirCancion(0)}}).fail(function(response){alert("Error interno. Inténtelo más tarde.")})})}
function setLista(que_lista){var lista;if(que_lista==0){lista=sessionStorage.getItem("listaRecientes")}
else{lista=sessionStorage.getItem("listaRecomendaciones")}
sessionStorage.setItem("listaAux",lista)}
function cargar_lista_favoritos(){var post_url="/ps/VerLista"
var request_method="post";var form_data="nombreLista=Favoritos&nombreCreadorLista="+leerCookie("login");return $.ajax({url:post_url,type:request_method,data:form_data,})}
