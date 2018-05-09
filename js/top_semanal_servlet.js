$(document).ready(function() {
  $("#form_mostrar_top_semanal").submit(function(event){
      event.preventDefault(); //prevent default action

      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
      alert(response);
       var obj=JSON.parse(response);
       if(obj.error != undefined){
         if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
       }
       else if(obj.NoHayCanciones != undefined){
         //No hay resultados
          $("#titulopagina").after("<h2 id=\"sin_resul\">No hay canciones.</h2>");
       }
       else{
         cargar_lista_favoritos()
           .done(function(response){
            var obj1=JSON.parse(response);
            var favoritos=undefined;
              if(obj1.error != undefined){
                if(obj1.error.indexOf("Usuario no logeado en el servidor") >= 0){
                  //El usuario no esta logeado, quitar cookies e ir a inicio
                  borrarCookie("login");
                  borrarCookie("idSesion");
                  window.location = "inicio.html";
                }
              }
              else if(obj1.NoHayCanciones != undefined){
                //No hay resultados
              }
              else{
                var aux = obj1.canciones;
                if(aux.length > 0){
                  for (i in aux){//Quitar valor uploader porque en album no esta
                    delete aux[i].uploader;
                  }
                  favoritos = JSON.stringify(aux);
                }
              }
              mostrarPaginaconFav(obj,favoritos,"topsemanal","nada");
         }).
         fail(function(response){
             alert("Error interno. Inténtelo más tarde.");
         });
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
  $("#form_mostrar_top_semanal").submit();
});
