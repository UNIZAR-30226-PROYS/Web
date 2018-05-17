$(document).ready(function() {
  var elem_por_pagina = 4;
  var url_string = window.location.href;
  var url = new URL(url_string);
  var pag_actual = url.searchParams.get("pagina");
  var inicio;

  $("#form_mostrar_amigos").submit(function(event){
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
       else if(obj.SinSeguidos != undefined){
         //No hay resultados
         $("#anadir_lista").after("<h2 id=\"sin_resul\">No hay amigos.</h2>");
       }
       else{
         var amigos = obj.listaDeSeguidos;
         //Definir elementos a mostrar por pagina, pagina actual y valor a empezar a mostrar
         if(pag_actual == null){
           pag_actual = 1;
         }
         else{
           pag_actual = parseInt(pag_actual);
         }
         inicio=(pag_actual-1)*elem_por_pagina;
         for(i=inicio; i<(elem_por_pagina+inicio) && i<amigos.length;i++){
           var amigo=amigos[i].nombreSeguido;

           var image="../ps/images/"+amigo+".jpg";
           var large='<div class="cancioninf"><ul><li id="barraopciones"><a href="usuario.html'+"?usuario="+amigo+'"><div class="imagen"><img src="'+image+'" alt="Imagen lista" onerror="this.src=\'img/user.png\'"></div></a></li><li id="barraopciones"><a href="usuario.html'+"?usuario="+amigo+'"><div class="nombrecancion">'+amigo+'</div></a></li><li id="barraopciones"><form class="form_borrar_amigo" method="post" action="/ps/DejarDeSeguirUsuario"><div class="simb_repr_elim"><input type="image" src="img/eliminar.png" alt="Eliminar amigo" title="Eliminar amigo"></div><input type="hidden" id="seguido" name="nombreSeguido" value="'+amigo+'"/></form></li></ul></div><br/>';
           $(".informacion").append(large);
         }
         if((elem_por_pagina+inicio)<amigos.length){
           var pagina_sig=pag_actual+1;
           var boton_mas = '<br><br><form action="amigos.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
           $(".informacion").append(boton_mas);
         }
       }
       form_mostrar_amigos();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_mostrar_amigos").submit();

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
});



  //Definir los form, sino puede que no se capture el submit
function form_mostrar_amigos(){
  $(".form_borrar_amigo").submit(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method
      var amigo = form_data.slice(14);

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
         $("#resultado_seguir").text("Amigo eliminado correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button1').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
}
