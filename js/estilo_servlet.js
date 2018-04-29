$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var inicio;
  var c = url.searchParams.get("estilo");
  if(c == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="home.html";
  }
  $( "#texto_nombre_busqueda" ).append(c);


});
