$(document).ready(function() {
  document.title = "Subir música";
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
      var i=response.indexOf("\n");
      var respuesta=response;
      var hay_fallos=0;
      while(i>=0){
        var auxiliar=JSON.parse(respuesta.substr(0,i)).error;
        if(auxiliar!=undefined){
          $("#resultado_seguir").append("-"+auxiliar);
          $("#resultado_seguir").append("<br>");
          hay_fallos=1;
        }
        respuesta=respuesta.substr(i+1);
        i=respuesta.indexOf("\n");

      }
      if(hay_fallos == 0){
        $("#resultado_seguir").text("Canciones subidas correctamente.");
        $("#result_seguir").attr("src","img/exito.png");
      }
      else{
        $(".window-container1").width(800);
        $("#result_seguir").attr("src","img/error.png");
      }
       $('.button1').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

});
