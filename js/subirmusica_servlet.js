$(document).ready(function() {
  $("#form_subir_musica").submit(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var form_data = new FormData(document.getElementById("form_subir_musica")); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,
          dataType: "html",
          cache: false,
          contentType: false,
          processData: false,

          xhr: function () {
              var xhr = new window.XMLHttpRequest();
              xhr.upload.addEventListener("progress", function (evt) {
                  if (evt.lengthComputable) {
                      var percentComplete = evt.loaded / evt.total;
                      percentComplete = parseInt(percentComplete * 100);
                      $('.myprogress').text(percentComplete + '%');
                      $('.myprogress').css('width', percentComplete + '%');
                  }
              }, false);
              return xhr;
          }

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
           $("#resultado_seguir").text(obj.error);
           $("#result_seguir").attr("src","img/error.png");
         }
       }
       else{
         $("#resultado_seguir").text("Canción subida correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button1').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

});
