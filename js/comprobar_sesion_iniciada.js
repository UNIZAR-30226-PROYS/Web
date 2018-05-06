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
