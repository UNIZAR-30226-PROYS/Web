var url_string = window.location.href;
var url = new URL(url_string);
var artista = url.searchParams.get("artista");
if(artista == null){
  //Si no hay artista en la url redirige al home
  window.location = "home.html";
}

$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var aux = url.searchParams.get("artista");
  var artista = $.trim(aux);
  //Poner artista en titulo pagina
  $("#nombre_artista_titulo").append(artista);

  document.title = "Artista "+artista;

  //Definir el form de mostrar albumes
  $("#form_mostrar_albumes_artista").submit(function(event){
      event.preventDefault(); //prevent default action

      //Establecer valor del nombre de artista
      document.getElementById("nombre_artista_album").value=artista;
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
         if(obj.error.indexOf("Usuario no logeado") >= 0){
           cerrarSesion();
         }
         else{
           //Suponer no hay albumes y mostrar sin resultados
         }
       }
       else{
         var albumes = obj.albums;

         //Añadir titulo albumes y seccion
         if(albumes.length > 0){
           var l='<div id="titulopagina"><h3>Álbumes</h3></div><div class="albumes"><ul id="lista_albumes"></ul></div>';
           $("#titulopagina").after(l);
           var url_string = window.location.href;
           var url = new URL(url_string);
           var aux = url.searchParams.get("artista");
           var artista = $.trim(aux);

           for(i=0;i<albumes.length;i++){
             var album=albumes[i].nombre;

             var image_aux=albumes[i].ruta_imagen;
             var indexi = image_aux.indexOf("/ps");
             var image = ".."+image_aux.substr(indexi);
             var large='<li id="barraopciones"> <div class="cancioninf"><a href="album.html'+"?album="+album+'&artista='+artista+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen album" onerror="this.src=\'img/Unknown_Album.png\'"></div><div class="nombrecancion">'+album+'</div></a></div></li>';
             $("#lista_albumes").append(large);
           }
         }
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_mostrar_albumes_artista").submit();

  //Definir el form de mostrar albumes
  $("#form_mostrar_canciones_artista").submit(function(event){
      event.preventDefault(); //prevent default action

      //Establecer valor del nombre de artista
      document.getElementById("nombre_artista_cancion").value=artista;
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
         if(obj.error.indexOf("Usuario no logeado") >= 0){
           cerrarSesion();
         }
         else{
           //Suponer no hay canciones y mostrar sin resultados
         }
       }
       else{
         var canciones = obj.canciones;

         var canciones_string = JSON.stringify(canciones);
         sessionStorage.setItem("listaAux",canciones_string);

         //Añadir titulo albumes y seccion
         if(canciones.length > 0){
           var l='<div id="tituloestilo"><h3>Canciones</h3></div><div class="cancionesArtista"><ul id="lista_canciones_artista"></ul></div>';
           $("#separador_album_cancion").after(l);

           for(i=0;i<canciones.length;i++){
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
             var large='<li id="barraopciones"><div class="cancioninf"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&genero='+n_genero+'&uploader='+n_uploader+'&ruta='+ruta+'&ruta_imagen='+image+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion" onClick="setIndiceAndPlay('+i+',1)" onerror="this.src=\'img/Unknown_Music.png\'"></div><div class="nombrecancion" onClick="setIndiceAndPlay('+i+',1)">'+n_cancion+'</div></a></div></li>';
             $("#lista_canciones_artista").append(large);
           }
         }
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_mostrar_canciones_artista").submit();


  $("#form_buscar_artista").submit(function(event){
      event.preventDefault(); //prevent default action
      //Quitar espacios en blanco a la izquierda y si no hay texto no se envia la busqueda
      var valor_busqueda = document.getElementById("form_buscar_artista").elements[0].value;
      var valor_sin_espacioizquierdo = $.trim(valor_busqueda);
      document.getElementById("search_artista").value=valor_sin_espacioizquierdo;
      if(valor_sin_espacioizquierdo == ""){
        return false;
      }

      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
      var obj=JSON.parse(response);
      var lista_artistas = JSON.stringify(response);
      if(obj.error != undefined){
        if(obj.error.indexOf("Usuario no logeado") >= 0){
          cerrarSesion();
        }
        else if(obj.error.indexOf("artista cuyo nombre sea o empiece") >= 0){
          sessionStorage.setItem("lista_usuarios", lista_usuarios);
          //Pasar tambien el valor de busqueda
          window.location= "busqueda_artistas.html?busqueda_artista="+valor_sin_espacioizquierdo+"&pagina=1";
        }
        else{
          alert("Error. Inténtelo más tarde.");
        }
      }
      else{
        sessionStorage.setItem("lista_artistas", lista_artistas);
        //Pasar tambien el valor de busqueda
        window.location= "busqueda_artistas.html?busqueda_artista="+valor_sin_espacioizquierdo+"&pagina=1";
      }
    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
});
