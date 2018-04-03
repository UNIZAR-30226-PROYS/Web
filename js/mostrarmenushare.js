/*Función para mostrar menu de compartir cancion*/

function mostrarMenuShare(){
    var x = document.getElementById("share-buttons");
    if (x.style.zIndex == "-100") {
        x.style.zIndex = "0";
    } else {
        x.style.zIndex = "-100";
    }
}
