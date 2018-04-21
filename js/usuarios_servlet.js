$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var c = url.searchParams.get("busqueda_usuario");
  $( "#texto_nombre_busqueda" ).append("\"" + c + "\"");
  var jsonData = JSON.parse(JSON.parse(sessionStorage.getItem("lista_usuarios")));

  var usuarios = jsonData.usuarios;
  if(usuarios != undefined){
    //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
    var elem_por_pagina = 4;
    var pag_actual= parseInt(url.searchParams.get("pagina"));
    var inicio=(pag_actual-1)*elem_por_pagina;
    for(i=inicio; i<(elem_por_pagina+inicio) && i<usuarios.length;i++){
      var user=usuarios[i];
      var image="img/user.png";
      var large='<form name="accionLista" method="post" action="#"><div class="cancioninf"><ul><li id="barraopciones"><a href="usuario.html'+"?usuario="+user+'"><div class="imagen"><img src="'+image+'" alt="Imagen lista"></div></a></li><li id="barraopciones"><a href="usuario.html'+"?usuario="+user+'"><div class="nombrecancion">'+user+'</div></a></li><li id="barraopciones"><div class="simb_repr_elim"><input type="image" src="img/add_friend.png" alt="Añadir amigo" title="Añadir amigo"></div></li></ul></div></form>';
      $(".informacion").append(large);
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

    }).done(function(response){ //
       var obj=JSON.parse(response);
        var lista_usuarios = JSON.stringify(response);
        sessionStorage.setItem("lista_usuarios", lista_usuarios);
        //Pasar tambien el valor de busqueda
        window.location= "usuarios.html?busqueda_usuario="+valor_sin_espacioizquierdo+"&pagina=1";

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
});
