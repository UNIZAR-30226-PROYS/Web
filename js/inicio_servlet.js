$(document).ready(function() {
  //Si se ha cerrado la sesion, informar y borrar la cookie
  if(leerCookie("sesionCerrada") != null){
    $("#inf_acceso").css("color", "#088A08");
    $("#inf_acceso").html("Sesión cerrada con éxito.");
    borrarCookie("sesionCerrada");
  }
  else if(leerCookie("cuentaEliminada") != null){
    $("#inf_acceso").css("color", "#088A08");
    $("#inf_acceso").html("Cuenta eliminada con éxito.");
    borrarCookie("cuentaEliminada");
  }

  $("#form_acceso").submit(function(event){
      event.preventDefault(); //prevent default action
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
          $("#inf_acceso").css("color", "red");
          $("#inf_acceso").html(obj.error);
        }
        else{
          //Establecer cookies login e idsesion y cambiar de pagina
          crearCookie("login",obj.login,10);
          crearCookie("idSesion",obj.idSesion,10);
          window.location = "home.html";
        }

    }).fail(function(response){ //
        $("#inf_acceso").css("color", "red");
        $("#inf_acceso").html("Error interno. Inténtelo más tarde.");
    });

  });


  $("#form_registro").submit(function(event){
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
          if(obj.error.indexOf("La contrase") >= 0){
            $("#inf_registro").html("La contraseña no es válida.");
          }
          else{ //(obj.error.indexOf("El usuario") >= 0){
            $("#inf_registro").html("El usuario ya existe.");
          }
        }
        else{
          $('.close').click();
          $('.button1').click();
        }

    }).fail(function(response){ //
        $("#inf_registro").html("Error interno. Inténtelo más tarde.");
    });

  });
});
