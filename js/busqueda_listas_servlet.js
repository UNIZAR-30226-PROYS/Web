$(document).ready(function() {
  var elem_por_pagina = 4;
  var url_string = window.location.href;
  var url = new URL(url_string);
  var pag_actual = url.searchParams.get("pagina");
  var inicio;
  if(pag_actual == null){
    pag_actual = 1;
  }
  var c = url.searchParams.get("busqueda_lista");
  if(c == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="home.html";
  }
  $( "#texto_nombre_busqueda" ).append("\"" + c + "\"");
  var jsonData = JSON.parse(JSON.parse(sessionStorage.getItem("lista_listas")));

  var listas = jsonData.busquedaListas;
  if(listas != undefined){
    var inicio=(pag_actual-1)*elem_por_pagina;
    var sin_elementos = 1;
    for(i=inicio; i<(elem_por_pagina+inicio) && i<listas.length;i++){
      var lista=listas[i].nombre;
      var autor=listas[i].nombreUsuario;
      if("Favoritos" != lista){
        var large='<div class="cancioninf"><ul><li id="barraopciones"><a href="lista.html'+"?lista="+lista+'&autor='+autor+'" id="enlacecancion"><div class="imagen"><img src="img/listaicono.png" alt="Imagen lista"></div></a></li><li id="barraopciones"><a href="lista.html'+"?lista="+lista+'&autor='+autor+'"><div class="nombrecancion">'+lista+'</div><div class="nombreautor">Autor: '+autor+'</div></a></li><li id="barraopciones"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir lista" title="Reproducir lista" onClick="playMusic(\'media/Blue Browne.mp3\');return false;"></div></li></ul></div>';
        $(".informacion").append(large);
        sin_elementos = 0;
      }
    }
    if(sin_elementos == 1){
      //No hay resultados ya que solo habia uno que era el propio usuario y no se muestra
      $("#titulopagina").after("<h2 id=\"sin_resul\">No hay resultados.</h2>");
    }
    else if((elem_por_pagina+inicio)<listas.length){
      var pagina_sig=pag_actual+1;
      var boton_mas = '<br><br><form action="busqueda_listas.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="busqueda_lista" value="'+c+'"/><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
      $(".informacion").append(boton_mas);
    }
  }
  else{
    //No hay resultados
    $("#titulopagina").after("<h2 id=\"sin_resul\">No hay resultados.</h2>");
  }

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
});
