$(document).ready(function() {
  var elem_por_pagina = 4;
  var url_string = window.location.href;
  var url = new URL(url_string);
  var pag_actual = url.searchParams.get("pagina");
  var inicio;

  $("#form_mostrar_listas").submit(function(event){
      event.preventDefault(); //prevent default action
      //Establecer el usuario de la cookie para enviar al servidor
      document.getElementById("form_mostrar_listas").elements[0].value = leerCookie("login");
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
         //No hay resultados
         $("#anadir_lista").after("<h2 id=\"sin_resul\">No hay listas.</h2>");
       }
       else{
         var listas = obj.nombre;
         sessionStorage.setItem("listas", JSON.stringify(response));
         //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
         if(pag_actual == null){
           pag_actual = 1;
         }
         else{
           pag_actual = parseInt(pag_actual);
         }
         inicio=(pag_actual-1)*elem_por_pagina;
         for(i=inicio; i<(elem_por_pagina+inicio) && i<listas.length;i++){
           var lista=listas[i];
           var large='<form name="accionLista" method="post" action="#"><div class="cancioninf"><ul><li id="barraopciones"><a href="lista.html'+"?lista="+lista+'" id="enlacecancion"><div class="imagen"><img src="img/listaicono.png" alt="Imagen lista"></div></a></li><li id="barraopciones"><a href="lista.html'+"?lista="+lista+'"><div class="nombrecancion">'+lista+'</div></a></li><li id="barraopciones"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir lista" title="Reproducir lista" onClick="playMusic(\'media/Blue Browne.mp3\');return false;"></div></li><li id="barraopciones"><div class="simb_repr_elim"><input type="image" src="img/eliminar.png" alt="Eliminar lista" title="Eliminar lista"></div></li></ul></div></form>';
           $(".informacion").append(large);
         }
         if((elem_por_pagina+inicio)<listas.length){
           var pagina_sig=pag_actual+1;
           var boton_mas = '<br><br><form action="listas.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
           $(".informacion").append(boton_mas);
         }
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  if(pag_actual == null){//No hay informacion, solicitar al servidor
    $("#form_mostrar_listas").submit();
  }
  else{
    //Ya estan mostrar siguiente pagina
    pag_actual = parseInt(pag_actual);
    inicio=(pag_actual-1)*elem_por_pagina;

    var jsonData = JSON.parse(JSON.parse(sessionStorage.getItem("listas")));
    var listas = jsonData.nombre;
    for(i=inicio; i<(elem_por_pagina+inicio) && i<listas.length;i++){
      var lista=listas[i];
      var large='<form name="accionLista" method="post" action="#"><div class="cancioninf"><ul><li id="barraopciones"><a href="lista.html'+"?lista="+lista+'" id="enlacecancion"><div class="imagen"><img src="img/listaicono.png" alt="Imagen lista"></div></a></li><li id="barraopciones"><a href="lista.html'+"?lista="+lista+'"><div class="nombrecancion">'+lista+'</div></a></li><li id="barraopciones"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir lista" title="Reproducir lista" onClick="playMusic(\'media/Blue Browne.mp3\');return false;"></div></li><li id="barraopciones"><div class="simb_repr_elim"><input type="image" src="img/eliminar.png" alt="Eliminar lista" title="Eliminar lista"></div></li></ul></div></form>';
      $(".informacion").append(large);
    }
    if((elem_por_pagina+inicio)<listas.length){
      var pagina_sig=pag_actual+1;
      var boton_mas = '<br><br><form action="listas.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
      $(".informacion").append(boton_mas);
    }
  }


  $("#form_crear_lista").submit(function(event){
      event.preventDefault(); //prevent default action
      //Quitar espacios en blanco a la izquierda y si no hay texto no se envia la busqueda
      var valor_lista = document.getElementById("form_crear_lista").elements[0].value;
      var valor_sin_espacioizquierdo = $.trim(valor_lista);
      document.getElementById("IdUsar").value=valor_sin_espacioizquierdo;
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
       if(obj.error != undefined){
         $("#resultado_seguir").text("Ya existe la lista "+ valor_sin_espacioizquierdo+ ".");
         $("#result_seguir").attr("src","img/error.png");
       }
       else{
         $("#resultado_seguir").text("Lista creada correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button1').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

});
