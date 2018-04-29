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
alert(sessionStorage.getItem("lista_canciones"));
  var canciones = jsonData.canciones;
  if(canciones != undefined){
    //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
    var elem_por_pagina = 4;
    var pag_actual= parseInt(url.searchParams.get("pagina"));
    var inicio=(pag_actual-1)*elem_por_pagina;
    //ESTABLECER claves tittuloCancion, nombreArtisa, nombreAlbum y genero
    for(i=inicio; i<(elem_por_pagina+inicio) && i<canciones.length;i++){
      var cancion=canciones[i].tituloCancion;
      var artista=canciones[i].nombreArtista;
      var image="img/edsheeranperfect.jpg";
      //FALTA PONER EL FORMATO ADECUADO
      var l='<form name="accionCancion" method="post" action="#"><div class="cancioninf"><ul><li id="barraopciones"><a href="cancion.html?nombre='+cancion+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion"></div></a></li><li id="barraopciones"><div class="nombre_autor_cancion"><a href="cancion.html?nombre='+cancion+'" id="enlacecancion"><div class="nombrecancion">'+cancion+'</div></a><a href="artista.html?artista='+artista+'" id="enlacecancion"><div class="nombreautor">'+artista+'</div></a></div></li><li id="barraopciones"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir cancion" title="Reproducir canción"';
      var i= ' onClick="playMusic(\'media/Georgia.mp3\');return false;"></div></li><li id="barraopciones"><div class="simb_repr_fav"><input type="image" src="img/favoritos.png" alt="Añadir a favoritos" title="Añadir/quitar favoritos" onclick="changeImage(this)" action="none"></div></li><li id="barraopciones"><div class="simb_repr_lista"><input type="image" src="img/listas_add.png" alt="Añadir a lista" class="button" title="Añadir a lista" onclick="return false" data-type="zoomin"></div></li></ul></div></form>';
      var large = l + i;
      $(".informacion").append(large);
    }
    if((elem_por_pagina+inicio)<canciones.length){
      var pagina_sig=pag_actual+1;
      var boton_mas = '<br><br><form action="busqueda.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="busqueda_cancion" value="'+c+'"/><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
      $(".informacion").append(boton_mas);
    }
  }
  else{
    //No hay resultados
    $("#titulopagina").after("<h2 id=\"sin_resul\">No hay resultados.</h2>");
  }

});
