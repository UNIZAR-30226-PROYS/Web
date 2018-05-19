function changeImage(image) {
    //var image = document.getElementById('imagen_favorito');
    if (image.src.match("img/favoritos")) {
        image.src = "img/favanadido.png";
    } else {
        image.src = "img/favoritos.png";
    }
}
