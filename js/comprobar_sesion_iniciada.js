//Comprobar si estan las dos cookies (sesion iniciada) y en caso contrario pasar a inicio
if(leerCookie("login") == null || leerCookie("idSesion") == null){
  window.location = "inicio.html"
}
