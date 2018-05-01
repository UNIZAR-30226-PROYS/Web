$(document).ready(function() {
  $("#form_mostrar_amigos").submit(function(event){
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
       }
       else if(obj.SinSeguidos != undefined){
         //No hay resultados
         if(document.getElementById("sin_resul") == null){
           //Poner que no hay amigos solo una vez
           $("#subir_cancion_titulo").after("<h2 id=\"sin_resul\">No hay amigos.</h2>");
         }
         $('.button0').click();
       }
       else{
         var amigos = obj.listaDeSeguidos;
         for(i=0;i<amigos.length;i++){
           var amigo=amigos[i].nombreSeguido;
           //Cambiar cuando JSON devuelva imagen
           var image="img/user.png";
           //AÑADIR CAMPOS DE LA CANCION COMO INPUT HIDDEN PARA ENVIAR AL SERVLET
           var large='<form class="form_compartir_cancion" method="post" action="/ps/CompartirCancion"><tr ><a href="#" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen usuario"></div><div class="nombreamigo">'+amigo+'</div></a></tr></form>';
           $("#lista_amigos").append(large);
         }
         form_mostrar_amigos();
         $('.button0').click();
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

});



  //Funcion que define form para compartir cancion con amigos
  //FALTA POR HACER
function form_mostrar_amigos(){
  $(".form_compartir_cancion").submit(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method
      var amigo = form_data.slice(14);

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
       var obj=JSON.parse(response);
       //Mostrar mensaje correspondiente en forma de ventana
       if(obj.error != undefined){
         if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
         else{
           alert("Error interno. Inténtelo más tarde.");
         }
       }
       else{
         $("#resultado_seguir").text("Amigo eliminado correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button1').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
}
