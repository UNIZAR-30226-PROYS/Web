function fileImgValidation(){var e=document.getElementById("fichero"),i=e.value;if(!/(.jpg)$/i.exec(i))return alert("Por favor sube un fichero de extensión .jpg"),e.value="",!1}
