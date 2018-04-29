$(document).ready(function() {
  var elem_por_pagina = 20;
  var url_string = window.location.href;
  var url = new URL(url_string);
  var inicio;
  var c = url.searchParams.get("album");
  if(c == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="home.html";
  }
  $( "#texto_nombre_busqueda" ).append(c);
  c = url.searchParams.get("artista");
  if(c == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="home.html";
  }
  $( "#titulo_artista" ).append(c);

  //FALTA MOSTRAR CANCIONES

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
        }   //////////////////////////CAMBIAR/////////////////
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
