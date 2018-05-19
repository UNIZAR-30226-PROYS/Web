$(document).ready(function() {
  var elem_por_pagina = 20;
  var url_string = window.location.href;
  var url = new URL(url_string);
  var pag_actual = url.searchParams.get("pagina");
  if(pag_actual == null){
    pag_actual = 1;
  }
  var inicio;
  var c = url.searchParams.get("busqueda_album");
  if(c == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="home.html";
  }

  document.title = "Búsqueda álbumes: "+c;
  $( "#texto_nombre_busqueda" ).append("\"" + c + "\"");
  var jsonData = JSON.parse(JSON.parse(sessionStorage.getItem("lista_albumes")));

  var albumes = jsonData.albums;
  if(albumes != undefined){
    var inicio=(pag_actual-1)*elem_por_pagina;
    var sin_elementos = 1;
    for(i=inicio; i<(elem_por_pagina+inicio) && i<albumes.length;i++){
      var album=albumes[i].nombre;
      var artista=albumes[i].artista;

      var image_aux=albumes[i].ruta_imagen;
      var indexi = image_aux.indexOf("/ps");
      var image = ".."+image_aux.substr(indexi);
      var large='<li id="barraopciones"> <div class="cancioninf"><a href="album.html'+"?album="+album+'&artista='+artista+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion" onerror="this.src=\'img/Unknown_Album.png\'"></div><div class="nombrecancion">'+album+'</div></a></div></li>';
      $("#lista_albumes").append(large);
      sin_elementos = 0;
    }
    if(sin_elementos == 1){
      //No hay resultados ya que solo habia uno que era el propio usuario y no se muestra
      $("#titulopagina").after("<h2 id=\"sin_resul\">No hay resultados.</h2>");
    }
    else if((elem_por_pagina+inicio)<albumes.length){
      var pagina_sig=pag_actual+1;
      var boton_mas = '<br><br><form action="busqueda_albumes.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="busqueda_album" value="'+c+'"/><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
      $(".informacion").append(boton_mas);
    }
  }
  else{
    //No hay resultados
    $("#titulopagina").after("<h2 id=\"sin_resul\">No hay resultados.</h2>");
  }

  $("#form_buscar_album").submit(function(event){
      event.preventDefault(); //prevent default action
      //Quitar espacios en blanco a la izquierda y si no hay texto no se envia la busqueda
      var valor_busqueda = document.getElementById("form_buscar_album").elements[0].value;
      var valor_sin_espacioizquierdo = $.trim(valor_busqueda);
      document.getElementById("search_album").value=valor_sin_espacioizquierdo;
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
      var lista_albumes = JSON.stringify(response);
      if(obj.error != undefined){
        if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
          //El usuario no esta logeado, quitar cookies e ir a inicio
          borrarCookie("login");
          borrarCookie("idSesion");
          window.location = "inicio.html";
        }
        else if(obj.error.indexOf("album cuyo nombre sea o empiece") >= 0){
          sessionStorage.setItem("lista_albumes", lista_albumes);
          //Pasar tambien el valor de busqueda
          window.location= "busqueda_albumes.html?busqueda_album="+valor_sin_espacioizquierdo+"&pagina=1";
        }
        else{
          alert("Error. Inténtelo más tarde.");
        }
      }
      else{
        sessionStorage.setItem("lista_albumes", lista_albumes);
        //Pasar tambien el valor de busqueda
        window.location= "busqueda_albumes.html?busqueda_album="+valor_sin_espacioizquierdo+"&pagina=1";
      }
    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
});
