$(document).ready(function() {
  var elem_por_pagina = 20;
  var url_string = window.location.href;
  var url = new URL(url_string);
  var pag_actual = url.searchParams.get("pagina");
  var inicio;

  //Definir el form de mostrar albumes
  $("#form_mostrar_artistas").submit(function(event){
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
       if(obj.error != undefined){
         if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
       }
       else{
         var lista_artistas = JSON.stringify(response);
         sessionStorage.setItem("lista_artistas", lista_artistas);
         var artistas = obj.artistas;
         //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
         if(pag_actual == null){
           pag_actual = 1;
         }
         else{
           pag_actual = parseInt(pag_actual);
         }
         inicio=(pag_actual-1)*elem_por_pagina;
         for(i=inicio; i<(elem_por_pagina+inicio) && i<artistas.length;i++){
           var artista=artistas[i];
           //Cambiar cuando JSON devuelva imagen
           var image="img/blackWindows.jpg";
           var large='<li id="barraopciones"> <div class="cancioninf"><a href="artista.html'+"?artista="+artista+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion"></div><div class="nombrecancion">'+artista+'</div></a></div></li>';
           $("#lista_artistas").append(large);
         }
         if((elem_por_pagina+inicio)<artistas.length){
           var pagina_sig=pag_actual+1;
           var boton_mas = '<br><br><form action="albumes.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
           $(".informacion").append(boton_mas);
         }
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

/*
  var jsonData = JSON.parse(JSON.parse(sessionStorage.getItem("lista_artistas")));
  if(jsonData != undefined){
    var artists = jsonData.artists;
    if(artists != undefined){
      if(pag_actual == null){
        pag_actual = 1;
      }
      inicio=(pag_actual-1)*elem_por_pagina;
      for(i=inicio; i<(elem_por_pagina+inicio) && i<artists.length;i++){
        var artista=artists[i];
        //Cambiar cuando JSON devuelva imagen
        var image="img/blackWindows.jpg";
        var large='<li id="barraopciones"> <div class="cancioninf"><a href="artista.html'+"?artista="+artista+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion"></div><div class="nombrecancion">'+artista+'</div></a></div></li>';
        $("#lista_artistas").append(large);

      }
      if((elem_por_pagina+inicio)<artists.length){
        var pagina_sig=pag_actual+1;
        var boton_mas = '<br><br><form action="albumes.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
        $(".informacion").append(boton_mas);
      }
    }
    else{
      //No hay albumes, solicitar al servidor la lista
      $("#form_mostrar_artistas").submit();
    }
  }
  else{
    //No hay albumes, solicitar al servidor la lista
    $("#form_mostrar_artistas").submit();
  }
  */
  $("#form_mostrar_artistas").submit();

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
        if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
          //El usuario no esta logeado, quitar cookies e ir a inicio
          borrarCookie("login");
          borrarCookie("idSesion");
          window.location = "inicio.html";
        }
        else if(obj.error.indexOf("artista cuyo nombre sea o empiece") >= 0){
          sessionStorage.setItem("lista_usuarios", lista_usuarios);
          //Pasar tambien el valor de busqueda
          window.location= "busqueda_artistas.html?busqueda_artista="+valor_sin_espacioizquierdo+"&pagina=1";
        }
        else{
          alert("Error. Inténtelo más tarde."+obj.error);
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
