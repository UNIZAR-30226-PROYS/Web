$(window).load(function() {
  $(".form_mostrar_listas_c").submit(function(event){
      event.preventDefault(); //prevent default action
      $('.button').click();
      if($(".form_anadir_cancion_lista")[0]){
        //Si ya existe algun clase del form, es que ya se pulso, no volver a pulsar ya que sino se duplican las listas
        return false;
      }
      //El user de la cookie se debe establecer al mostrar la cancion en la web
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
           //No hay resultados
           $(".close").after("<h2 id=\"sin_resul\">No hay listas.</h2>");
         }
       }
       else{
         var listas = obj.nombre;
         for(i=0;i<listas.length;i++){
           var lista=listas[i];
           var large='<form class="form_anadir_cancion_lista" action="/ps/AnyadirCancionALista" method="post"><div class="nombrelista"><input type="submit" class="anadir_cancion_lista_f" value="'+lista+'"><input type="hidden" id="nombreLista" value="'+lista+'"></div></form>';
           $(".ventana_listas").append(large);
         }
       }

    }).fail(function(response){
        //alert("Error interno. Inténtelo más tarde.");
    });
  });
});
