$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var c = url.searchParams.get("busqueda_cancion");
  if(c == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="home.html";
  }
  $( "#texto_nombre_busqueda" ).append("\"" + c + "\"");
  var jsonData = JSON.parse(JSON.parse(sessionStorage.getItem("lista_canciones")));
  if(jsonData == undefined){
    return false;
  }

  document.title = "Búsqueda canciones: "+c;

  var canciones = jsonData.canciones;

  if(canciones != undefined){
    var canciones_string = JSON.stringify(canciones);
    sessionStorage.setItem("listaAux",canciones_string);

    cargar_lista_favoritos()
      .done(function(response){
       var obj1=JSON.parse(response);
       var favoritos=undefined;
         if(obj1.error != undefined){
           if(obj1.error.indexOf("Usuario no logeado en el servidor") >= 0){
             //El usuario no esta logeado, quitar cookies e ir a inicio
             borrarCookie("login");
             borrarCookie("idSesion");
             window.location = "inicio.html";
           }
         }
         else if(obj1.NoHayCanciones != undefined){
           //No hay resultados
         }
         else{
           var aux = obj1.canciones;
           if(aux.length > 0){
             for (i in aux){//Quitar valor uploader porque en album no esta
               delete aux[i].uploader;
             }
             favoritos = JSON.stringify(aux);
           }
         }
         //Llamar a mostrar album con la lista del album y de favoritos
         mostrarBusquedaconFav(jsonData,favoritos);
       }).
       fail(function(response){
           alert("Error interno. Inténtelo más tarde.");
       });
     }
     else{
       //No hay resultados
       $("#titulopagina").after("<h2 id=\"sin_resul\">No hay resultados.</h2>");
     }
});

/* Muestra la busqueda de canciones con informacion de favoritos (si o no)
 * En la lista favoritos la clave uploader no aparece debido a que en busqueda no esta
 */
function mostrarBusquedaconFav(obj,favoritos){
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("busqueda_cancion");
    var canciones = obj.canciones;
    //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
    var elem_por_pagina = 5;
    var pag_actual= parseInt(url.searchParams.get("pagina"));
    if(pag_actual == null){
      pag_actual = 1;
    }
    else{
      pag_actual = parseInt(pag_actual);
    }
    var lista_favoritos=favoritos;
    var inicio=(pag_actual-1)*elem_por_pagina;
    for(i=inicio; i<(elem_por_pagina+inicio) && i<canciones.length;i++){
      var n_cancion=canciones[i].tituloCancion;
      var n_artista=canciones[i].nombreArtista;
      var n_genero=canciones[i].genero;
      var n_album=canciones[i].nombreAlbum;
      //Cambiar ruta por la ruta relativa
      var ruta_aux=canciones[i].ruta;
      var index = ruta_aux.indexOf("/ps");
      var ruta = ".."+ruta_aux.substr(index);
      var n_uploader=canciones[i].uploader;

      var image_aux=canciones[i].ruta_imagen;
      var indexi = image_aux.indexOf("/ps");
      var image = ".."+image_aux.substr(indexi);
      if(n_genero==null){
        n_genero= "";
      }
      if(n_album==null){
        n_album= "";
      }
      var en_favoritos, servlet, imagen_favoritos, msg, form;
      if(lista_favoritos != undefined){
        en_favoritos=lista_favoritos.includes(JSON.stringify(canciones[i]));
      }
      else{
        en_favoritos=false;
      }

      if(en_favoritos == true){
        servlet="QuitarCancionDeLista";
        imagen_favoritos="favanadido.png";
        msg="Quitar de favoritos";
        form="form_quitar_favorito";
      }
      else{
         servlet="AnyadirCancionALista";
         imagen_favoritos="favoritos.png";
         msg="Añadir a favoritos";
         form="form_poner_favorito";
      }

      var l1='<div class="cancioninf"><ul><li id="barraopciones"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&genero='+n_genero+'&uploader='+n_uploader+'&ruta='+ruta+'&ruta_imagen='+image+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion" onClick="setIndiceAndPlay('+i+',1)" onerror="this.src=\'img/Unknown_Music.png\'"></div></a></li>';
      var l2='<li id="barraopciones"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&genero='+n_genero+'&uploader='+n_uploader+'&ruta='+ruta+'&ruta_imagen='+image+'" id="enlacecancion"><div class="nombrecancion" onClick="setIndiceAndPlay('+i+',1)">'+n_cancion+'</div></a><a href="artista.html?artista='+n_artista+'" id="enlacecancion"><div class="nombreautor">Artista: '+n_artista+'</div></a></li>';

      var play='<li id="barraopciones"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir cancion" title="Reproducir canción" onClick="setIndiceAndPlay('+i+',0);return false;"></div></li>';

      var fav='<form class="'+form+'" method="post" action="/ps/'+servlet+'"><li id="barraopciones"><div class="simb_repr_fav"><input type="image" src="img/'+imagen_favoritos+'" alt="'+msg+'" title="'+msg+'"></div><input type="hidden" name="ruta" value="'+ruta_aux+'"/><input type="hidden" name="nombreLista" value="Favoritos"/></li></form>';
      var anadir_lista='<form class="form_mostrar_listas_c" method="post" action="/ps/MostrarListasReproduccion"><li id="barraopciones"><div class="simb_repr_lista"><div class="simb_repr_lista"><input type="hidden" id="user" name="user" value="'+leerCookie("login")+'"><input type="hidden" name="ruta" value="'+ruta_aux+'"/><input type="image" src="img/listas_add.png" alt="Añadir a lista" class="boton_mostrar_listas" title="Añadir a lista"></div></div></li></form>';
      var final='</ul></div>';
      $(".informacion").append(l1+l2+play+fav+anadir_lista+final);
    }
    if((elem_por_pagina+inicio)<canciones.length){
      var pagina_sig=pag_actual+1;
      var boton_mas = '<br><br><form action="busqueda.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="busqueda_cancion" value="'+c+'"/><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
      $(".informacion").append(boton_mas);
    }
    //Definir form para anadir a listas
    form_mostrar_anadir_alistas();
    form_anadirquitar_cancion_a_favorito();
}
