$(document).ready(function() {
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
          $("#inf_acceso").html(obj.error);
        }
        else{
          //Establecer cookies login e idsesion y cambiar de pagina
          crearCookie("login",obj.login,10);
          crearCookie("idSesion",obj.idSesion,10);
          window.location = "home.html"
        }

    }).fail(function(response){ //
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
          $("#inf_registro").html(obj.error);
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
