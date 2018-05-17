$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var c = url.searchParams.get("busqueda_usuario");
  if(c == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="home.html";
  }

  document.title = "Búsqueda usuarios: "+c;

  $( "#texto_nombre_busqueda" ).append("\"" + c + "\"");
  var jsonData = JSON.parse(JSON.parse(sessionStorage.getItem("lista_usuarios")));

  var usuarios = jsonData.usuarios;
  if(usuarios != undefined){
    //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
    var elem_por_pagina = 6;
    var pag_actual= parseInt(url.searchParams.get("pagina"));
    var inicio=(pag_actual-1)*elem_por_pagina;
    var sin_elementos = 1;
    for(i=inicio; i<(elem_por_pagina+inicio) && i<usuarios.length;i++){
      var user=usuarios[i];
      var image="../ps/images/"+user+".jpg";
      if(leerCookie("login") != user){ //Poner opcion añadir amigo solo si no es el mismo
        var large='<form class="form_seguir_usuario" method="post" action="/ps/SeguirUsuario"><div class="cancioninf"><ul><li id="barraopciones"><a href="usuario.html'+"?usuario="+user+'"><div class="imagen"><img src="'+image+'" alt="Imagen lista" onerror="this.src=\'img/user.png\'"></div></a></li><li id="barraopciones"><a href="usuario.html'+"?usuario="+user+'"><div class="nombrecancion">'+user+'</div></a></li><li id="barraopciones"><div class="simb_repr_elim"><input type="image" src="img/add_friend.png" alt="Añadir amigo" title="Añadir amigo"><input type="hidden" id="seguido" name="seguido" value="'+user+'"/></div></li></ul></div></form>';
        $(".informacion").append(large);
        sin_elementos = 0;
      }
    }
    if(sin_elementos == 1){
      //No hay resultados ya que solo habia uno que era el propio usuario y no se muestra
      $("#titulopagina").after("<h2 id=\"sin_resul\">No hay resultados.</h2>");
    }
    if((elem_por_pagina+inicio)<usuarios.length){
      var pagina_sig=pag_actual+1;
      var boton_mas = '<br><br><form action="usuarios.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="busqueda_usuario" value="'+c+'"/><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
      $(".informacion").append(boton_mas);
    }
  }
  else{
    //No hay resultados
    $("#titulopagina").after("<h2 id=\"sin_resul\">No hay resultados.</h2>");
  }

  $("#form_buscar_amigos").submit(function(event){
      event.preventDefault(); //prevent default action
      //Quitar espacios en blanco a la izquierda y si no hay texto no se envia la busqueda
      var valor_busqueda = document.getElementById("form_buscar_amigos").elements[0].value;
      var valor_sin_espacioizquierdo = $.trim(valor_busqueda);
      document.getElementById("search_user").value=valor_sin_espacioizquierdo;
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
        var lista_usuarios = JSON.stringify(response);
        if(obj.error != undefined){
          if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
            //El usuario no esta logeado, quitar cookies e ir a inicio
            borrarCookie("login");
            borrarCookie("idSesion");
            window.location = "inicio.html";
          }
          else if(obj.error.indexOf("usuario cuyo nombre sea o empiece") >= 0){
            sessionStorage.setItem("lista_usuarios", lista_usuarios);
            //Pasar tambien el valor de busqueda
            window.location= "usuarios.html?busqueda_usuario="+valor_sin_espacioizquierdo+"&pagina=1";
          }
          else{
            alert("Error. Inténtelo más tarde.");
          }
        }
        else{
          sessionStorage.setItem("lista_usuarios", lista_usuarios);
          //Pasar tambien el valor de busqueda
          window.location= "usuarios.html?busqueda_usuario="+valor_sin_espacioizquierdo+"&pagina=1";
        }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $(".form_seguir_usuario").submit(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method
      var user = form_data.slice(8);

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){ //
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
           $("#resultado_seguir").text("Ya estas siguiendo a "+ user+ ".");
           $("#result_seguir").attr("src","img/error.png");
         }
       }
       else{
         $("#resultado_seguir").text("Usuario añadido como amigo.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button1').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
});
