$(document).ready(function() {
  $("#form_mostrar_top_semanal").submit(function(event){
      event.preventDefault(); //prevent default action

      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
      alert(response);
       var obj=JSON.parse(response);
       if(obj.error != undefined){
         if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
       }
       else if(obj.NoHayCanciones != undefined){
         //No hay resultados
          $("#titulopagina").after("<h2 id=\"sin_resul\">No hay canciones.</h2>");
       }
       else{
         var url_string = window.location.href;
         var url = new URL(url_string);
         var pag_actual = url.searchParams.get("pagina");
         //  MOSTRAR CANCIONES CON CAMPOS SOLO SI ES DEL PROPIO USUARIO
         var canciones = obj.canciones;
         //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
         if(pag_actual == null){
           pag_actual = 1;
         }
         else{
           pag_actual = parseInt(pag_actual);
         }
         var elem_por_pagina = 5;
         inicio=(pag_actual-1)*elem_por_pagina;
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
           //CAMBIAR IMAGEN
           var image="img/edsheeranperfect.jpg";
           if(n_genero==null){
             n_genero= "";
           }
           if(n_album==null){
             n_album= "";
           }
           var l1='<div class="cancioninf"><ul><li id="barraopciones"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&genero='+n_genero+'&uploader='+n_uploader+'&ruta='+ruta+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion"></div></a></li>';
           var l2='<li id="barraopciones"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&genero='+n_genero+'&uploader='+n_uploader+'&ruta='+ruta+'" id="enlacecancion"><div class="nombrecancion">'+n_cancion+'</div></a><a href="artista.html?artista='+n_artista+'" id="enlacecancion"><div class="nombreautor">Artista: '+n_artista+'</div></a></li>';

           var param_playmusic="\'"+ruta+"\',"+"\'"+image+"\',"+"\'"+n_cancion+"\',"+"\'"+n_artista+"\',"+"\'"+n_album+"\',"+"\'"+n_uploader+"\',"+"\'"+n_genero+"\'";
           var play='<li id="barraopciones"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir cancion" title="Reproducir canción" onClick="playMusic('+param_playmusic+');return false;"></div></li>';
           //*******************MODIFICAR FAVORITOS   *****************************************
           var fav='<form name="accionCancion" method="post" action="#"><li id="barraopciones"><div class="simb_repr_fav"><input type="image" src="img/favoritos.png" alt="Añadir a favoritos" title="Añadir/quitar favoritos" onclick="changeImage(this)"></div></li></form>';
           var anadir_lista='<form class="form_mostrar_listas_c" method="post" action="/ps/MostrarListasReproduccion"><li id="barraopciones"><div class="simb_repr_lista"><div class="simb_repr_lista"><input type="hidden" id="user" name="user" value="'+leerCookie("login")+'"><input type="hidden" name="tituloCancion" value="'+n_cancion+'"><input type="hidden" name="nombreArtista" value="'+n_artista+'"><input type="hidden" name="nombreAlbum" value="'+n_album+'"><input type="image" src="img/listas_add.png" alt="Añadir a lista" class="boton_mostrar_listas" title="Añadir a lista"></div></div></li></form>';
           var final='</ul></div>';
           $(".informacion").append(l1+l2+play+fav+anadir_lista+final);
         }
         if((elem_por_pagina+inicio)<canciones.length){
           var pagina_sig=pag_actual+1;
           var boton_mas = '<br><br><form action="topsemanal.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
           $(".informacion").append(boton_mas);
         }
       }
       //Definir form para anadir a listas
       form_mostrar_anadir_alistas();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
  $("#form_mostrar_top_semanal").submit();
});
