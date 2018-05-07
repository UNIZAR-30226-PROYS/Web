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

//Reproduce la cancion actual (indiceLista) de la lista listaActual guardada en sessionStorage
function reproducirCancion(){
  //  Comprobar si hay que hacer parse a JSON o no
    var canciones =JSON.parse(sessionStorage.getItem("listaActual"));
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
    playMusic(ruta,image,cancion,artista,album,uploader,genero);
}

//Reproduce la cancion actual (indiceLista) de la lista listaActual guardada en sessionStorage
function siguienteCancion(){
  //  Comprobar si hay que hacer parse a JSON o no
    var canciones =JSON.parse(sessionStorage.getItem("listaActual"));
    var i=parseInt(sessionStorage.getItem("indiceLista"));
    i = i + 1;
    //Si no hay siguiente volver a la primera
    if(i == canciones.length){
      i=0;
    }
    sessionStorage.setItem("indiceLista",i);
    reproducirCancion();
}

//Reproduce la cancion actual (indiceLista) de la lista listaActual guardada en sessionStorage
function anteriorCancion(){
  //  Comprobar si hay que hacer parse a JSON o no
    var canciones =JSON.parse(sessionStorage.getItem("listaActual"));
    var i=parseInt(sessionStorage.getItem("indiceLista"));
    i = i - 1;
    //Si no hay siguiente volver a la primera
    if(i < 0){
      i=canciones.length - 1;
    }
    sessionStorage.setItem("indiceLista",i);
    reproducirCancion();


    //alert(getRandomInt(0,canciones.length));
}

//Funcion que se ejecuta cuando una cancion acaba
//Se pone timeout porque si no sale excepcion (se ejec play y luego pausa asi play se ejec al final)
function finCancion() {
  window.setTimeout(function(){
    siguienteCancion();
  }, 100);

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
