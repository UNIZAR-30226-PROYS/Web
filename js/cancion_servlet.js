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

  //Quitar los dos puntos y coger el resto y añadir la base
  var ruta_aux="/usr/local/apache-tomcat-9.0.7/webapps"+ruta.substr(2);

  //Establecer valores para form favorito
  document.getElementById('rutafav').value=ruta_aux;


  //A veces puede no iniciarse asi que espera run tiempo y reproducir
  window.setTimeout(function(){
    reloadMusic();
  }, 100);


  $("#compartir_facebook").attr("href", "http://www.facebook.com/sharer.php?u="+url_string);

  $("#compartir_twitter").attr("data-text", "Canción: "+cancion+"\nArtista: "+artista+"\n");
  $("#compartir_twitter").attr("data-url", url_string);

  //Poner datos para poder mostrar listas
  document.getElementById('botonlista_user').value=leerCookie("login");
  document.getElementById('botonlista_ruta').value=ruta_aux;


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
       //Llamar a mostrar album con la lista del album y de favoritos
       mostrarCancionconFav(cancion,artista,album,genero,ruta,favoritos);
    }).
    fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
        sessionStorage.setItem("listaFavoritos",undefined);
    });

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
           var image="../ps/images/"+amigo+".jpg";

           var large='<form class="form_compartir_cancion" method="post" action="/ps/CompartirCancion"><tr ><div class="imagen"><img src="'+image+'" alt="Imagen usuario" onerror="this.src=\'img/user.png\'"></div><input type="submit" class="nombreamigo" value="'+amigo+'"/><input type="hidden" name="titulo" value="'+cancion+'"/><input type="hidden" name="nombreAlbum" value="'+album+'"/><input type="hidden" name="nombreArtista" value="'+artista+'"/><input type="hidden" name="genero" value="'+genero+'"/><input type="hidden" name="usuarioDestino" value="'+amigo+'"/></tr></form>';
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


function  mostrarCancionconFav(cancion,artista,album,genero,ruta,favoritos){
   var lista_fav=favoritos;
   var esta_en_fav=0;
   ruta=ruta.substr(2); //Quitar los dos puntos del principio

  if(lista_fav != undefined){
    lista_fav=JSON.parse(lista_fav);
     for (i in lista_fav){
       if(artista == lista_fav[i].nombreArtista && cancion == lista_fav[i].tituloCancion
          && album == lista_fav[i].nombreAlbum &&
          lista_fav[i].ruta.indexOf(ruta) >=0 ){
          if(genero == lista_fav[i].genero || genero == "" || genero == null){
            esta_en_fav=1;
            break;
          }
       }
     }
   }

   if(esta_en_fav == 1){
     document.getElementById('imagen_fav').src="img/favanadido.png";
     document.getElementById('imagen_fav').alt="Quitar de favoritos";
     document.getElementById('imagen_fav').title="Quitar de favoritos";
     document.getElementById('form_poner_fav').class="form_quitar_favorito";
     document.getElementById('form_poner_fav').action="/ps/QuitarCancionDeLista";
   }

   form_anadirquitar_cancion_a_favorito();
}
