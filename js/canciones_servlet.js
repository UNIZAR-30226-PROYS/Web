/* Se ejecuta al pulsar añadir a lista en una cancion y recibe parametros de user, titulo cancion, artista y album
 * y muestra las listas como un form cada una con los campos de nombreLista, tituloCancion, nombreArtista y nombreAlbum
 */
function form_mostrar_anadir_alistas(){
  //$(".form_mostrar_listas_c").submit(function(event){
  $(".boton_mostrar_listas").click(function(event){
      event.preventDefault(); //prevent default action

      //Coger elemento form del input image que se pulsa(imagen lista)
      var form = $(this).parent().parent().parent().parent();
      var post_url = form.attr("action"); //get form action url
      var form_data = form.serialize(); //Encode form elements for submission
      var request_method = form.attr("method"); //get form GET/POST method

      //Coger el padre (div simb_repr_lista) e ir cogiendo el valor de los input
      var contenedor=$(this).parent().children();
      var tituloCancion = contenedor.get(1).value;
      var nombreArtista = contenedor.get(2).value;
      var nombreAlbum = contenedor.get(3).value;

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
           $(".close11").after("<h2 id=\"sin_resul\">No hay listas.</h2>");
         }
       }
       else{
         var listas = obj.nombre;
         var sin_resul=1;
         for(i=0;i<listas.length;i++){
           var lista=listas[i];
           if(lista != "Favoritos"){
             var large='<form class="form_anadir_cancion_lista" action="/ps/AnyadirCancionALista" method="post"><div class="nombrelista"><input type="submit" class="anadir_cancion_lista_f" value="'+lista+'"><input type="hidden" name="nombreLista" value="'+lista+'"><input type="hidden" name="tituloCancion" value="'+tituloCancion+'"><input type="hidden" name="nombreArtista" value="'+nombreArtista+'"><input type="hidden" name="nombreAlbum" value="'+nombreAlbum+'"></div></form>';
             $(".ventana_listas").append(large);
             sin_resul=0;
           }
         }
         if(sin_resul == 1 && !$("#sin_resul")[0]){
           $(".close11").after("<h2 id=\"sin_resul\">No hay listas.</h2>");
         }
         form_anadir_cancion_a_lista(); //Definir la captura de los form de añadir cancion a lista
       }
       $('.button11').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
}

/* Form para añadir cancion a lista. Se usa una ventana (result_anadir_lista con valor 10)
 * para mostrar el resultado en todas las pantallas necesarias
 */
function form_anadir_cancion_a_lista(){
  $(".form_anadir_cancion_lista").submit(function(event){
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
         else{
           alert("Error. Inténtelo más tarde.");s
         }
       }
       else if(obj.CancionYaExisteEnLista){
         $("#resultado_seguir").text("La canción ya existe en la lista.");
         $("#result_seguir").attr("src","img/error.png");
       }
       else{
         $("#resultado_seguir").text("Canción añadida a la lista.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button10').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
}
