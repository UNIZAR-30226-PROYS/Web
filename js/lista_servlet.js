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
         var autor = url.searchParams.get("autor");
         if(leerCookie("login") == autor){
           //Es del propio usuario, mostrar campos cambiar nombre y subir musica
           $('.editar_lista').css('display','block');
           $('.anadir_lista').css('display','block');
         }
         /*   MOSTRAR CANCIONES CON CAMPOS SOLO SI ES DEL PROPIO USUARIO
         var listas = obj.nombre;
         //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
         if(pag_actual == null){
           pag_actual = 1;
         }
         else{
           pag_actual = parseInt(pag_actual);
         }
         inicio=(pag_actual-1)*elem_por_pagina;
         var sin_elementos = 1;
         for(i=inicio; i<(elem_por_pagina+inicio) && i<listas.length;i++){
           var lista=listas[i];
           if("Favoritos" != lista){
             var large='<div class="cancioninf"><ul><li id="barraopciones"><a href="lista.html'+"?lista="+lista+'" id="enlacecancion"><div class="imagen"><img src="img/listaicono.png" alt="Imagen lista"></div></a></li><li id="barraopciones"><a href="lista.html'+"?lista="+lista+'"><div class="nombrecancion">'+lista+'</div></a></li><li id="barraopciones"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir lista" title="Reproducir lista" onClick="playMusic(\'media/Blue Browne.mp3\');return false;"></div></li><li id="barraopciones"><form class="form_borrar_lista" method="post" action="/ps/BorrarListaDeReproduccion"><div class="simb_repr_elim"><input type="image" src="img/eliminar.png" alt="Eliminar lista" title="Eliminar lista"></div><input type="hidden" id="seguido" name="nombreLista" value="'+lista+'"/></form></li></ul></div>';
             $(".informacion").append(large);
             sin_elementos = 0;
           }
         }
         if(sin_elementos == 1){
           //No hay resultados
           $("#anadir_lista").after("<h2 id=\"sin_resul\">No hay listas.</h2>");
         }
         if((elem_por_pagina+inicio)<listas.length){
           var pagina_sig=pag_actual+1;
           var boton_mas = '<br><br><form action="listas.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
           $(".informacion").append(boton_mas);
         } */
       }
       //form_borrar_lista(); Poner funcion para definir los form

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
      alert(response);
       var obj=JSON.parse(response);
       if(obj.error != undefined){
         if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
         else{
           $("#resultado_seguir").text(obj.error+".");
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
