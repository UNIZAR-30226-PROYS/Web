$(document).ready(function() {
  $("#form_mostrar_estilos").submit(function(event){
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
       else{
         var estilos = obj.generos;

         for(i=0;i<estilos.length;i++){
           var estilo=estilos[i];
           var large='<li id="barraopciones"><div class="cancioninf"><a href="estilo.html'+"?estilo="+estilo+'" id="enlacecancion"><div class="marco_estilo">'+estilo+'</div></a></div></li>';
           $("#lista_estilos").append(large);
         }
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

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
       else{
         var canciones = obj.canciones;

         var canciones_string = JSON.stringify(canciones);
         sessionStorage.setItem("listaAux",canciones_string);

         for(i=0;i<canciones.length;i++){
           var n_cancion=canciones[i].tituloCancion;
           var n_artista=canciones[i].nombreArtista;
           var n_genero=canciones[i].genero;
           var n_album=canciones[i].nombreAlbum;
           //Cambiar ruta por la ruta relativa
           var ruta_aux=canciones[i].ruta;
           var index = ruta_aux.indexOf("/ps");
           var ruta = ".."+ruta_aux.substr(index);

           var n_uploader=canciones[i].uploader;
           //CAMBIAR IMAGEN
           var image="img/edsheeranperfect.jpg";
           if(n_genero==null){
             n_genero= "";
           }
           if(n_album==null){
             n_album= "";
           }
           var large='<li id="barraopciones"><div class="cancioninf"><a href="cancion.html?nombre='+n_cancion+'&artista='+n_artista+'&album='+n_album+'&genero='+n_genero+'&uploader='+n_uploader+'&ruta='+ruta+'" id="enlacecancion"><div class="imagen"><img src="'+image+'" alt="Imagen cancion" onClick="setIndiceAndPlay('+i+',1)"></div><div class="nombrecancion" onClick="setIndiceAndPlay('+i+',1)">'+cancion+'</div></a></div></li>';
           $("#lista_top_semanal").append(large);
         }
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_mostrar_estilos").submit();
  $("#form_mostrar_top_semanal").submit();
});
