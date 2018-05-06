$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var cancion = url.searchParams.get("nombre");
  var artista = url.searchParams.get("artista");
  var album = url.searchParams.get("album");
  var genero = url.searchParams.get("genero");
  var uploader = url.searchParams.get("uploader");
  var ruta = url.searchParams.get("ruta");

  if(cancion == undefined || artista == undefined || album == undefined || genero == undefined || uploader == undefined || ruta == undefined){
    //Falta algun parametro en la url
    window.location="home.html";
  }

  //CAMBIAR CUANDO ESTE, SI ES NECESARIO MODIFICAR ENLACES A CANCION.HTML AÑADIENDO PARAMETRO IMAGEN
  var imagen ="img/edsheeranperfect.jpg";

  audio_core=$('#audio-player').attr('src', ruta)[0];
  document.getElementById('imagen_cancion_wrapper').src=imagen;
  document.getElementById('nombrecancion').innerHTML=cancion;
  document.getElementById('autor1').innerHTML=artista;
  var enlace="artista.html?artista="+artista;
  document.getElementById('enlacecancion_wrapper').href=enlace;

  //A veces puede no iniciarse asi que espera run tiempo y reproducir
  window.setTimeout(function(){
    reloadMusic();
  }, 100);


  $("#compartir_facebook").attr("href", "http://www.facebook.com/sharer.php?u="+url_string);

  $("#compartir_twitter").attr("data-text", "Canción: "+cancion+"\nArtista: "+artista+"\n");
  $("#compartir_twitter").attr("data-url", url_string);

  //Poner datos para poder mostrar listas
  document.getElementById('botonlista_user').value=leerCookie("login");
  document.getElementById('botonlista_cancion').value=cancion;
  document.getElementById('botonlista_artista').value=artista;
  document.getElementById('botonlista_album').value=album;


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

           var large='<form class="form_compartir_cancion" method="post" action="/ps/CompartirCancion"><tr ><div class="imagen"><img src="'+image+'" alt="Imagen usuario"></div><input type="submit" class="nombreamigo" value="'+amigo+'"/><input type="hidden" name="titulo" value="'+cancion+'"/><input type="hidden" name="nombreAlbum" value="'+album+'"/><input type="hidden" name="nombreArtista" value="'+artista+'"/><input type="hidden" name="genero" value="'+genero+'"/><input type="hidden" name="usuarioDestino" value="'+amigo+'"/></tr></form>';
           $("#lista_amigos").append(large);
         }
         form_mostrar_amigos();
         $('.button0').click();
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
  form_mostrar_anadir_alistas();
});

  //Funcion que define form para compartir cancion con amigos
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
      alert(response);
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
         $("#resultado_seguir").text("Canción compartida con amigo.");
         $("#result_seguir").attr("src","img/exito.png");
       }
       $('.button1').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
}
