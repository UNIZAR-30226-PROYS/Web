$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var c = url.searchParams.get("lista");
  var autor = url.searchParams.get("autor");
  if(c == undefined || autor == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="home.html";
  }
  $("#prueba").append(c);

  $("#form_mostrar_lista").submit(function(event){
      event.preventDefault(); //prevent default action
      var url_string = window.location.href;
      var url = new URL(url_string);
      var nombreLista = url.searchParams.get("lista");
      var autor = url.searchParams.get("autor");

      document.getElementById("form_mostrar_lista").elements[0].value = nombreLista;
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
         var url_string = window.location.href;
         var url = new URL(url_string);
         var autor = url.searchParams.get("autor");
         if(leerCookie("login") == autor){
           //Es del propio usuario, mostrar campos cambiar nombre y subir musica
           $('.editar_lista').css('display','block');
           $('.anadir_lista').css('display','block');
         }
          $("#separador").after("<h2 id=\"sin_resul\">No hay canciones.</h2>");
       }
       else{
         var url_string = window.location.href;
         var url = new URL(url_string);
         var pag_actual = url.searchParams.get("pagina");
         var autor = url.searchParams.get("autor");
         var es_lista_propia = 0;
         if(leerCookie("login") == autor){
           //Es del propio usuario, mostrar campos cambiar nombre y subir musica
           $('.editar_lista').css('display','block');
           $('.anadir_lista').css('display','block');
           es_lista_propia = 1; //bool para mostrar campo de eliminar cancion o no
         }
         //  MOSTRAR CANCIONES CON CAMPOS SOLO SI ES DEL PROPIO USUARIO
         var canciones = obj.canciones;
         //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
         if(pag_actual == null){
           pag_actual = 1;
         }
         else{
           pag_actual = parseInt(pag_actual);
         }
         var elem_por_pagina = 4;
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
           var l1='<div class="cancioninf"><ul><li id="barraopciones"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&uploader='+n_uploader+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion"></div></a></li>';
           var l2='<li id="barraopciones"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&uploader='+n_uploader+'" id="enlacecancion"><div class="nombrecancion">'+n_cancion+'</div></a>';
           var l3='<a href="artista.html?artista='+n_artista+'"><div class="nombreautor">Artista: '+n_artista+'</div></a>';
           var seccion_genero='<a href="estilo.html?estilo='+n_genero+'"><div class="nombregenero">Género: '+n_genero+'</div></a>';
           var param_playmusic="\'"+ruta+"\',"+"\'"+image+"\',"+"\'"+n_cancion+"\',"+"\'"+n_artista+"\',"+"\'"+n_album+"\',"+"\'"+n_uploader+"\'";
           var l4='</li><li id="barraopciones"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir cancion" title="Reproducir canción" onClick="playMusic('+param_playmusic+');return false;"></div></li>';
           var elim_cancion='<form class="form_borrar_cancion_lista" method="post" action="/ps/QuitarCancionDeLista"><li id="barraopciones"><div class="simb_repr_elim"><input type="hidden" name="tituloCancion" value="'+n_cancion+'"/><input type="hidden" name="nombreArtista" value="'+n_artista+'"/><input type="hidden" name="nombreAlbum" value="'+n_album+'"/><input type="hidden" name="nombreLista" value="'+nombreLista+'"/><input type="image" src="img/eliminar.png" alt="Eliminar cancion de lista" title="Eliminar canción de lista"></div></li></form>';
           var final='</ul></div>';
           if(n_genero==""){ //Si no hay genero no mostrar esa seccion
             seccion_genero="";
           }
           if(es_lista_propia == 1){ //Mostrar opcion eliminar cancion
             $(".informacion").append(l1+l2+l3+seccion_genero+l4+elim_cancion+final);
           }
           else{
             $(".informacion").append(l1+l2+l3+seccion_genero+l4+final);
           }
         }
         if((elem_por_pagina+inicio)<canciones.length){
           var pagina_sig=pag_actual+1;
           var boton_mas = '<br><br><form action="lista.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="lista" value="'+nombreLista+'"/><input type="hidden" name="autor" value="'+autor+'"/><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
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




  $("#form_buscar_lista").submit(function(event){
      event.preventDefault(); //prevent default action
      //Quitar espacios en blanco a la izquierda y si no hay texto no se envia la busqueda
      var valor_busqueda = document.getElementById("form_buscar_lista").elements[0].value;
      var valor_sin_espacioizquierdo = $.trim(valor_busqueda);
      document.getElementById("search_lista").value=valor_sin_espacioizquierdo;
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
      var lista_listas = JSON.stringify(response);
      if(obj.error != undefined){
        if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
          //El usuario no esta logeado, quitar cookies e ir a inicio
          borrarCookie("login");
          borrarCookie("idSesion");
          window.location = "inicio.html";
        }
        else if(obj.error.indexOf("lista cuyo nombre coincida") >= 0){
          sessionStorage.setItem("lista_listas", lista_listas);
          //Pasar tambien el valor de busqueda
          window.location= "busqueda_listas.html?busqueda_lista="+valor_sin_espacioizquierdo+"&pagina=1";
        }
        else{
          alert("Error. Inténtelo más tarde.");
        }
      }
      else{
        sessionStorage.setItem("lista_listas", lista_listas);
        //Pasar tambien el valor de busqueda
        window.location= "busqueda_listas.html?busqueda_lista="+valor_sin_espacioizquierdo+"&pagina=1";
      }
    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_cambiar_nombre_lista").submit(function(event){
      event.preventDefault(); //prevent default action
      //Quitar espacios en blanco a la izquierda y si no hay texto no se envia la busqueda
      var valor_lista = document.getElementById("form_cambiar_nombre_lista").elements[1].value;
      var valor_sin_espacioizquierdo = $.trim(valor_lista);
      document.getElementById("IdUsar1").value=valor_sin_espacioizquierdo;
      if(valor_sin_espacioizquierdo == ""){
        return false;
      }
      var url_string = window.location.href;
      var url = new URL(url_string);
      var c = url.searchParams.get("lista");
      document.getElementById("viejoNombre").value=c;

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
         else{
           $("#resultado_seguir").text("Ya existe la lista "+ valor_sin_espacioizquierdo+ ".");
           $("#result_seguir").attr("src","img/error.png");
         }
       }
       else{
         $("#resultado_seguir").text("El nombre de la lista se ha cambiado correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
         //Ha ido bien, actualizar parametro en la URL de lista para que al cerrar ventana
         //haga reload a la direccion correcta
         updateQueryStringParam("lista",valor_sin_espacioizquierdo);
       }
       $('.button2').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_subir_musica").submit(function(event){
      event.preventDefault(); //prevent default action
      //Poner nombre de la lista
      var url_string = window.location.href;
      var url = new URL(url_string);
      var lista = url.searchParams.get("lista");
      document.getElementById("nombre_lista").value=lista;
      var post_url = $(this).attr("action"); //get form action url
      var form_data = new FormData(document.getElementById("form_subir_musica")); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,
          dataType: "html",
          cache: false,
          contentType: false,
          processData: false,

          xhr: function () {
              var xhr = new window.XMLHttpRequest();
              xhr.upload.addEventListener("progress", function (evt) {
                  if (evt.lengthComputable) {
                      var percentComplete = evt.loaded / evt.total;
                      percentComplete = parseInt(percentComplete * 100);
                      $('.myprogress').text(percentComplete + '%');
                      $('.myprogress').css('width', percentComplete + '%');
                  }
              }, false);
              return xhr;
          },

    }).done(function(response){
       var obj=JSON.parse(response);
       if(obj.error != undefined){
         if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
         else{
           $("#resultado_seguir").text(obj.error);
           $("#result_seguir").attr("src","img/error.png");
         }
       }
       else{
         $("#resultado_seguir").text("Canción subida correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button2').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
});

//Actualiza la URL de la pagina cambiando el parametro key al valor value, sin hacer reload
function updateQueryStringParam(key, value) {
  baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
  urlQueryString = document.location.search;
  var newParam = key + '=' + value,
  params = '?' + newParam;

  // If the "search" string exists, then build params from it
  if (urlQueryString) {
    keyRegex = new RegExp('([\?&])' + key + '[^&]*');
    // If param exists already, update it
    if (urlQueryString.match(keyRegex) !== null) {
      params = urlQueryString.replace(keyRegex, "$1" + newParam);
    } else { // Otherwise, add it to end of query string
      params = urlQueryString + '&' + newParam;
    }
  }
  window.history.replaceState({}, "", baseUrl + params);
}

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
