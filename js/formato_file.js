function fileValidation(){var e=document.getElementById("fichero"),a=e.value;if(!/(.mp3|.ogg|.acc)$/i.exec(a))return alert("Por favor sube un fichero de extensión .mp3/.ogg/.acc."),e.value="",!1}
