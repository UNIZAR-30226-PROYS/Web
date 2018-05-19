/*Función para verificar si el fichero a subir es del formato adecuado*/

function fileValidation(){
    var fileInput = document.getElementById('fichero');
    var filePath = fileInput.value;
    var allowedExtensions = /(.mp3|.ogg|.acc)$/i;
    if(!allowedExtensions.exec(filePath)){
        alert('Por favor sube un fichero de extensión .mp3/.ogg/.acc.');
        fileInput.value = '';
        return false;
    }
}
