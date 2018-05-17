$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var c = url.searchParams.get("usuario");
  if(c == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="perfil.html";
  }
  $( "#titulopagina" ).append("<h1>" + c + "</h1>");
  var elem_por_pagina = 4;
  var inicio;
  var pag_actual = url.searchParams.get("pagina");

  document.title = "Usuario: "+c;

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
        if(obj.error != undefined){
          if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
            //El usuario no esta logeado, quitar cookies e ir a inicio
            borrarCookie("login");
            borrarCookie("idSesion");
            window.location = "inicio.html";
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

  $("#form_mostrar_usuario").submit(function(event){
      event.preventDefault(); //prevent default action
      //Establecer el usuario de la cookie para enviar al servidor
      document.getElementById("form_mostrar_usuario").elements[0].value = c;
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
         var err = obj.error;
         var image="../ps/images/"+c+".jpg";
         if(err.indexOf("no sigue a") >= 0){ //No sigue al usuario


           var l='<div class="imagen"><img src="'+image+'" alt="Imagen usuario" onerror="this.src=\'img/user.png\'"></div>';
           $("#titulopagina").after(l);
           if(leerCookie("login") != c){ //Poner opcion añadir amigo solo si no es el mismo
             l='<form id="form_seguir_usuario" method="post" action="/ps/SeguirUsuario"><div class="anadir_lista"><input type="image" src="img/add_friend.png" alt="Añadir amigo" title="Añadir amigo"></div><input type="hidden" id="seguido" name="seguido" value="'+c+'"/></form>';
             $("#titulopagina").after(l);
           }

           l='No puedes ver las listas porque no lo sigues.';
           $(".block1").append(l);
         }
         else if(err.indexOf("no tiene ninguna lista asociada") >= 0){
           var l='<div class="imagen"><img src="'+image+'" alt="Imagen usuario" onerror="this.src=\'img/user.png\'"></div>';
           $("#titulopagina").after(l);
           if(leerCookie("login") != c){ //Poner opcion añadir amigo solo si no es el mismo
             l='<form id="form_seguir_usuario" method="post" action="/ps/SeguirUsuario"><div class="anadir_lista"><input type="image" src="img/add_friend.png" alt="Añadir amigo" title="Añadir amigo"></div><input type="hidden" id="seguido" name="seguido" value="'+c+'"/></form>';
             $("#titulopagina").after(l);
           }
         }
         else if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
         else{
           $("#titulopagina").after("<h2 id=\"sin_resul\">No existe el usuario.</h2>");
         }
       }
       else{
         var image="../ps/images/"+c+".jpg";
         //ESTABLECER IMAGEN O USAR OTRO FORM PARA VER CUAL ES
         var l='<div class="imagen"><img src="'+image+'" alt="Imagen usuario" onerror="this.src=\'img/user.png\'"></div>';
         $("#titulopagina").after(l);
         if(leerCookie("login") != c){ //Poner opcion añadir amigo solo si no es el mismo
           l='<form id="form_seguir_usuario" method="post" action="/ps/SeguirUsuario"><div class="anadir_lista"><input type="image" src="img/add_friend.png" alt="Añadir amigo" title="Añadir amigo"></div><input type="hidden" id="seguido" name="seguido" value="'+c+'"/></form>';
           $("#titulopagina").after(l);
         }

         var listas = obj.nombre;
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
           if("Favoritos" != lista){
             var large='<div class="cancioninf"><ul><li id="barraopciones"><a href="lista.html'+"?lista="+lista+'&autor='+c+'" id="enlacecancion"><div class="imagen"><img src="img/listaicono.png" alt="Imagen lista"></div></a></li>';
             var repr_lista='<li id="barraopciones"><form class="form_reproducir_lista" method="post" action="/ps/VerLista"><div class="simb_repr_play"><input type="image" src="img/play.png" alt="Reproducir lista" title="Reproducir lista"><input type="hidden" name="nombreLista" value="'+lista+'"/><input type="hidden" name="nombreCreadorLista" value="'+c+'"/></div></form></li>';
             var nombre_y_fin ='<li id="barraopciones"><a href="lista.html'+"?lista="+lista+'&autor='+c+'"><div class="nombrecancion">'+lista+'</div></a></li></ul></div>';
             $(".block1").append(large+repr_lista+nombre_y_fin);
           }
         }
         if((elem_por_pagina+inicio)<listas.length){
           var pagina_sig=pag_actual+1;
           var boton_mas = '<br><br><form action="usuario.html"><button type="submit" id="boton_mostrar_mas" class="aumentar">Mostrar más</button><input type="hidden" name="usuario" value="'+c+'"/><input type="hidden" name="pagina" value="'+pagina_sig+'"/></form>';
           $(".informacion").append(boton_mas);
         }
         form_repr_lista();
       }
       form_mostrar_usuario();
    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_mostrar_usuario").submit();
});

//Se ejecuta despues, una vez que esta el form cargado ya que sino puede que no lo capture
function form_mostrar_usuario(){
  $("#form_seguir_usuario").submit(function(event){
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
}
