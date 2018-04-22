$(document).ready(function() {
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
