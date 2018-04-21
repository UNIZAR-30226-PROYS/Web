$(document).ready(function() {
  $("#form_buscar_amigos").submit(function(event){
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
          alert(obj.error);
        }
        else{
          //Cambiar a pagina usuarios pasando la lista de usuarios
          var lista_usuarios = JSON.stringify(response);
          sessionStorage.setItem("lista_usuarios", lista_usuarios);
          //Pasar tambien el valor de busqueda
          var busqueda = document.getElementById("form_buscar_amigos").elements[0].value;
          window.location= "usuarios.html?busqueda_usuario="+busqueda;
        }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
        var busqueda = document.getElementById("form_buscar_amigos").elements[0].value;
        window.location= "usuarios.html?busqueda_usuario="+busqueda;
    });
  });
});
