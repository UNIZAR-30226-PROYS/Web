/*Función para verificar si el fichero a subir es del formato adecuado*/

function fileImgValidation(){
    var fileInput = document.getElementById('fichero');
    var filePath = fileInput.value;
    var allowedExtensions = /(.jpg|.png)$/i;
    if(!allowedExtensions.exec(filePath)){
        alert('Por favor sube un fichero de extensión .jpg/.png.');
        fileInput.value = '';
        return false;
    }
}
