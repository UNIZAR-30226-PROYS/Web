$(document).ready(function() {
  $(".form_buscar_cancion").submit(function(event){
      event.preventDefault(); //prevent default action
      //Quitar espacios en blanco a la izquierda y si no hay texto no se envia la busqueda
      var valor_busqueda = document.getElementById("form_buscar_cancion").elements[0].value;
      var valor_sin_espacioizquierdo = $.trim(valor_busqueda);
      document.getElementById("form_buscar_cancion").elements[0].value = valor_sin_espacioizquierdo;
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
        var lista_canciones = JSON.stringify(response);
        if(obj.error != undefined){
          if(obj.error.indexOf("Usuario no logeado") >= 0){
            cerrarSesion();
          }
        }
        else{
          sessionStorage.setItem("lista_canciones", lista_canciones);
          //Pasar tambien el valor de busqueda
          window.location= "busqueda.html?busqueda_cancion="+valor_sin_espacioizquierdo+"&pagina=1";
        }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
});
