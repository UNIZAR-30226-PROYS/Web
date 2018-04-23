$(document).ready(function() {
  $("#form_cerrar_sesion").submit(function(event){
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
});
