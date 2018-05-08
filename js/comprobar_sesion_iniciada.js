//Comprobar si estan las dos cookies (sesion iniciada) y en caso contrario pasar a inicio
if(leerCookie("login") == null || leerCookie("idSesion") == null){
  window.location = "inicio.html"
}

function playMusic(src,imagen,cancion,artista,album,uploader,genero){
      audio_core=$('#audio-player').attr('src', src)[0];
      document.getElementById('imagen_cancion_wrapper').src=imagen;
      document.getElementById('cancion_wrapper').innerHTML=cancion;
      var enlace="cancion.html?nombre="+cancion+"&artista="+artista+"&album="+album+'&genero='+genero+'&uploader='+uploader+'&ruta='+src;
      document.getElementById('enlacecancion_wrapper').href=enlace;

    audio_core.play() // <- play the song!!!
}

function reloadMusic(){
    var src=document.getElementById("audio-player").src;
      audio_core=$('#audio-player').attr('src', src)[0]
    audio_core.play() // <- play the song!!!
}

/*Reproduce la cancion actual (indiceLista) de la lista listaActual guardada en sessionStorage
 *Si no hay lista guardada se carga top semanal (las listas nunca seran vacias ya que sino
 * no se llama a esta funcion)
 * Si pagina_cancion==1 (esta en pagina cancion) solo se cambia la URL y va alli
 * sino actualiza el wrapper
 */
function reproducirCancion(pagina_cancion){
    var aux = sessionStorage.getItem("listaActual");
    if(aux == null){
      //Si no hay lista para reproducir se carga la lista de top semanal
      // que cuando el sistema funciones siempre tendra canciones
      cargar_lista_top_semanal();
    }
    else{
      var canciones =JSON.parse(aux);

      var i=sessionStorage.getItem("indiceLista");
      var cancion=canciones[i].tituloCancion;
      var artista=canciones[i].nombreArtista;
      var genero=canciones[i].genero;
      var album=canciones[i].nombreAlbum;
      //Cambiar ruta por la ruta relativa
      var ruta_aux=canciones[i].ruta;
      var index = ruta_aux.indexOf("/ps");
      var ruta = ".."+ruta_aux.substr(index);

      var uploader=canciones[i].uploader;
      //CAMBIAR IMAGEN
      var image="img/edsheeranperfect.jpg";
      if(pagina_cancion == 0){
        playMusic(ruta,image,cancion,artista,album,uploader,genero);
      }
      else{
        window.location = "cancion.html?nombre="+cancion+"&artista="+artista+"&album="+album+"&genero="+genero+"&uploader="+uploader+"&ruta="+ruta;
      }
    }
}

//Reproduce la cancion actual (indiceLista) de la lista listaActual guardada en sessionStorage
//Recibe un bool que indica si se ejecu en la pagina cancion o no
function siguienteCancion(pagina_cancion){
  //  Comprobar si hay que hacer parse a JSON o no
    var canciones =JSON.parse(sessionStorage.getItem("listaActual"));
    var i=parseInt(sessionStorage.getItem("indiceLista"));
    var aleatorio = sessionStorage.getItem("valor_aleatorio");
    if(aleatorio != null){
      if (aleatorio == 1){
        //Modo aleatorio
        i=getRandomInt(0,canciones.length);
      }
      else{
        //Modo en orden
        i = i + 1;
        //Si no hay siguiente volver a la primera
        if(i == canciones.length){
          i=0;
        }
      }
    }
    else{
      //Modo en orden
      i = i + 1;
      //Si no hay siguiente volver a la primera
      if(i == canciones.length){
        i=0;
      }
    }
    sessionStorage.setItem("indiceLista",i);
    reproducirCancion(pagina_cancion);
}

//Reproduce la cancion actual (indiceLista) de la lista listaActual guardada en sessionStorage
function anteriorCancion(pagina_cancion){
  //  Comprobar si hay que hacer parse a JSON o no
    var canciones =JSON.parse(sessionStorage.getItem("listaActual"));
    var i=parseInt(sessionStorage.getItem("indiceLista"));
    var aleatorio = sessionStorage.getItem("valor_aleatorio");
    if(aleatorio != null){
      if (aleatorio == 1){
        //Modo aleatorio
        i=getRandomInt(0,canciones.length);
      }
      else{
        //Modo en orden
        i = i - 1;
        //Si no hay anterior volver a la ultima
        if(i < 0){
          i=canciones.length - 1;
        }
      }
    }
    else{
      //Modo en orden
      i = i - 1;
      //Si no hay siguiente volver a la primera
      if(i < 0){
        i=canciones.length - 1;
      }
    }
    sessionStorage.setItem("indiceLista",i);
    reproducirCancion(pagina_cancion);
}

/* Se ejecuta al pulsar reproducir en alguna cancion y establece el indice de esa
 * cancion en la lista y la reproduce
 */
function setIndiceAndPlay(indice,a_pagina_cancion){
  sessionStorage.setItem("indiceLista",indice);
  //Si actual es distinta a Aux se establece Aux
  var listaActual = sessionStorage.getItem("listaActual");
  var listaAux = sessionStorage.getItem("listaAux");
  if(listaActual != listaAux){
    sessionStorage.setItem("listaActual",listaAux);
  }
  reproducirCancion(a_pagina_cancion);
}

//Funcion que se ejecuta cuando una cancion acaba
//Se pone timeout porque si no sale excepcion (se ejec play y luego pausa asi play se ejec al final)
//Si esta en pagina cancion, lo indica al llamar a la funcion y sino tambien
function finCancion() {
  var url = window.location.href;
  var pagina_cancion = 0;
  if(url.indexOf("cancion.html?") >= 0){
    pagina_cancion = 1;
  }
  window.setTimeout(function(){
    siguienteCancion(pagina_cancion);
  }, 100);

}

//Si esta puesto (checked) poner valor aleatorio a 1, sino a 0
function pulsadoAleatorio() {
  if(document.getElementById("valor_aleatorio").checked){
    sessionStorage.setItem("valor_aleatorio",1);
  }
  else{
    sessionStorage.setItem("valor_aleatorio",0);
  }
}


$(function(){
  $('#audio-player').mediaelementplayer({
  alwaysShowControls: true,
  features: ['playpause','progress','volume','duration'],
  audioVolume: 'horizontal',
  iPadUseNativeControls: true,
  iPhoneUseNativeControls: true,
  AndroidUseNativeControls: true
});
});

// Retorna un entero aleatorio entre min (incluido) y max (excluido)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Poner modo aleatorio visualización en off o en on
$(document).ready(function() {
  var valor_aleatorio = sessionStorage.getItem("valor_aleatorio");
  if(valor_aleatorio == null){
    valor_aleatorio = false;
  }
  else{
    if(valor_aleatorio == 0){
      valor_aleatorio = false;
    }
    else{
      valor_aleatorio=true;
    }
  }
  document.getElementById("valor_aleatorio").checked = valor_aleatorio;
  //Comenzar a reproducir cancion
  var url = window.location.href;
  var pagina_cancion = 0;
  if(url.indexOf("cancion.html?") >= 0){
    pagina_cancion = 1;
  }
  else{
    reproducirCancion(pagina_cancion);
  }
});


/* Solicita las canciones al servidor de top semanal
 */
function cargar_lista_top_semanal(){
    var post_url = "/ps/TopSemanal"
    var request_method = "post"; //get form GET/POST method

    $.ajax({
        url : post_url,
        type: request_method,

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
     else if(obj.NoHayCanciones != undefined){
       //No hay resultados
        alert("Top semanal no tiene canciones.");
     }
     else{
       var aux = obj.canciones;
       if(aux.length > 0){
         var canciones = JSON.stringify(aux);
         sessionStorage.setItem("listaActual",canciones);
         sessionStorage.setItem("indiceLista",0);
         var url = window.location.href;
         var pagina_cancion = 0;
         if(url.indexOf("cancion.html?") >= 0){
           pagina_cancion = 1;
         }
         reproducirCancion(pagina_cancion);
       }
       else{ //QUITA CUANDO SERVIDOR DEVUELVA CANCIONES EN TOP SEMANAL
         //alert("Top semanal no tiene canciones.")
       }
     }

  }).fail(function(response){
      alert("Error interno. Inténtelo más tarde.");
  });
}


/* Solicita las canciones al servidor y si no hay canciones muestra alert,
 * sino reproduce la primera y cuando acabe esa cancion o pulse siguiente
 * se reproduce la siguiente (si la hay)
 */
function form_repr_lista(){
  $(".form_reproducir_lista").submit(function(event){
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
       else if(obj.NoHayCanciones != undefined){
         //No hay resultados
          alert("La lista no tiene canciones.");
       }
       else{
         var canciones = JSON.stringify(obj.canciones);
         sessionStorage.setItem("listaActual",canciones);
         sessionStorage.setItem("indiceLista",0);
         //Llamar a fucion que reproduce la cancion indexada por indiceLista
         reproducirCancion(0);
       }

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
}

/* En pagina recientes hay dos listas (recientes y recomendados), si se quiere
 * reproducir una, al pulsar en play o enlace a cancion se llama a esta funcion que
 * establece el valor de listaAux que luego pasara a ser listaActual(en otra funcion)
 */
function setLista(que_lista){
  var lista;
  if(que_lista == 0){
    lista = sessionStorage.getItem("listaRecientes");
  }
  else{
    lista = sessionStorage.getItem("listaRecomendaciones");
  }
  sessionStorage.setItem("listaAux",lista);
}
