/*Función para mostrar menu de compartir cancion*/

function mostrarMenuShare(){
    var x = document.getElementById("share-buttons");
    if (x.style.opacity == "0") {
        x.style.opacity = "1";
    } else {
        x.style.opacity = "0";
    }
}
