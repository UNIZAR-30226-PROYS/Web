$(document).ready(function() {
  //Mostrar nombre y foto
  var nombre=leerCookie("login");
  document.getElementById("idNombre").value=nombre;
  document.getElementById("imagen_usuario_perfil").src="../ps/images/"+nombre+".jpg";

  $("#form_cerrar_sesion").submit(function(event){
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
          else{
            alert(obj.error);
          }
        }
        else{
          //Eliminar cookies login e idsesion y cambiar de pagina a inicio
          borrarCookie("login");
          borrarCookie("idSesion");
          crearCookie("sesionCerrada","true",1);
          window.location = "inicio.html"
        }

    }).fail(function(response){ //
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_cambio_nombre").submit(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method
      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
      $('.close1').click();
      var obj=JSON.parse(response);
      var lista_usuarios = JSON.stringify(response);
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
        $("#resultado_seguir").text("Nombre cambiado correctamente.");
        $("#result_seguir").attr("src","img/exito.png");
        //Cambiar cookie de login
        var nuevonombre=document.getElementById("IdUsar1").value;
        crearCookie("login",nuevonombre,10);
      }
      $('.button5').click();
    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_cambiar_contra").submit(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
       $('.close2').click();
       var obj=JSON.parse(response);
       if(obj.error != undefined){
         if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
         else{
           $("#resultado_seguir").text("La contraseña no es válida.");
           $("#result_seguir").attr("src","img/error.png");
         }
       }
       else{
         $("#resultado_seguir").text("Contraseña cambiada correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button5').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_eliminar_cuenta").submit(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
       $('.close3').click();
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
           $('.button5').click();
         }
       }
       else{ //Se ha eliminado la cuenta
         //Eliminar cookies login e idsesion y cambiar de pagina a inicio
         borrarCookie("login");
         borrarCookie("idSesion");
         crearCookie("cuentaEliminada","true",1);
         window.location = "inicio.html"
       }
    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_cambiar_foto").submit(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var form_data = new FormData(document.getElementById("form_cambiar_foto")); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,
          dataType: "html",
          cache: false,
          contentType: false,
          processData: false

    }).done(function(response){
       $('.close4').click();
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
         $("#resultado_seguir").text("Foto cambiada correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button5').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

});
