/*Función para verificar si el fichero a subir es del formato adecuado*/

function changeImage(){
    document.getElementById("simbolo_menu_imagen").src="img/simbolomenublanco.png"
}

function changeImageAntes(){
    document.getElementById("simbolo_menu_imagen").src="img/simbolomenu.png"
}

function changeUser(){
    document.getElementById("user").style="color:white"
    setTimeout(function() {
      document.getElementById("simbolo_user_menu").src="img/userblanco.png"
    }, 100);
}

function changeUserAntes(){
  document.getElementById("user").style="color:black";
  setTimeout(function() {
    document.getElementById("simbolo_user_menu").src="img/user.png"
  }, 100);
}
