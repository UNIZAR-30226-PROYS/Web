$(document).ready(function() {
  $("#form_mostrar_lista").submit(function(event){
      event.preventDefault(); //prevent default action
      var autor = leerCookie("login");

      document.getElementById("form_mostrar_lista").elements[0].value = "Favoritos";
      document.getElementById("form_mostrar_lista").elements[1].value = autor;
      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
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

         var canciones_string = JSON.stringify(canciones);
         sessionStorage.setItem("listaAux",canciones_string);

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
           var l1='<div class="cancioninf"><ul><li id="barraopciones"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&genero='+n_genero+'&uploader='+n_uploader+'&ruta='+ruta+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion" onClick="setIndiceAndPlay('+i+',1)"></div></a></li>';
           var l2='<li id="barraopciones"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&genero='+n_genero+'&uploader='+n_uploader+'&ruta='+ruta+'" id="enlacecancion"><div class="nombrecancion" onClick="setIndiceAndPlay('+i+',1)">'+n_cancion+'</div></a>';
           var l3='<a href="artista.html?artista='+n_artista+'"><div class="nombreautor">Artista: '+n_artista+'</div></a>';
           var seccion_genero='<a href="estilo.html?estilo='+n_genero+'"><div class="nombregenero">Género: '+n_genero+'</div></a>';

           var l4='</li><li id="barraopciones"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir cancion" title="Reproducir canción" onClick="setIndiceAndPlay('+i+',0);return false;"></div></li>';
           var elim_cancion='<form class="form_borrar_cancion_lista" method="post" action="/ps/QuitarCancionDeLista"><li id="barraopciones"><div class="simb_repr_elim"><input type="hidden" name="ruta" value="'+ruta_aux+'"/><input type="hidden" name="nombreLista" value="Favoritos"/><input type="image" src="img/eliminar.png" alt="Eliminar cancion de lista" title="Eliminar canción de lista"></div></li></form>';
           var final='</ul></div>';
           if(n_genero==""){ //Si no hay genero no mostrar esa seccion
             seccion_genero="";
           }
           $(".informacion").append(l1+l2+l3+seccion_genero+l4+elim_cancion+final);
         }
         if((elem_por_pagina+inicio)<canciones.length){
           var pagina_sig=pag_actual+1;
           var boton_mas = '<br><br><form action="favoritos.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
           $(".informacion").append(boton_mas);
         }
       }
       //Definir form para eliminar cancion
       form_borrar_cancion();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_mostrar_lista").submit();
});

function form_borrar_cancion(){
  $(".form_borrar_cancion_lista").submit(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
       var obj=JSON.parse(response);
       //Mostrar mensaje correspondiente en forma de ventana
       if(obj.error != undefined){
         if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
         else{
           alert("Error interno. Inténtelo más tarde.");
         }
       }
       else{
         $("#resultado_seguir").text("Canción eliminada correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button2').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
}
