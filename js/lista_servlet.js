$(document).ready(function() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var c = url.searchParams.get("lista");
  if(c == undefined){ //Si se ha ido directamente a la pagina redirigir
    window.location="home.html";
  }
  $("#prueba").append(c);


  $("#form_buscar_lista").submit(function(event){
      event.preventDefault(); //prevent default action
      //Quitar espacios en blanco a la izquierda y si no hay texto no se envia la busqueda
      var valor_busqueda = document.getElementById("form_buscar_lista").elements[0].value;
      var valor_sin_espacioizquierdo = $.trim(valor_busqueda);
      document.getElementById("search_lista").value=valor_sin_espacioizquierdo;
      if(valor_sin_espacioizquierdo == ""){
        return false;
      }

      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
      var obj=JSON.parse(response);
      var lista_listas = JSON.stringify(response);
      if(obj.error != undefined){
        if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
          //El usuario no esta logeado, quitar cookies e ir a inicio
          borrarCookie("login");
          borrarCookie("idSesion");
          window.location = "inicio.html";
        }
        else if(obj.error.indexOf("lista cuyo nombre coincida") >= 0){
          sessionStorage.setItem("lista_listas", lista_listas);
          //Pasar tambien el valor de busqueda
          window.location= "busqueda_listas.html?busqueda_lista="+valor_sin_espacioizquierdo+"&pagina=1";
        }
        else{
          alert("Error. Inténtelo más tarde.");
        }
      }
      else{
        sessionStorage.setItem("lista_listas", lista_listas);
        //Pasar tambien el valor de busqueda
        window.location= "busqueda_listas.html?busqueda_lista="+valor_sin_espacioizquierdo+"&pagina=1";
      }
    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });

  $("#form_cambiar_nombre_lista").submit(function(event){
      event.preventDefault(); //prevent default action
      //Quitar espacios en blanco a la izquierda y si no hay texto no se envia la busqueda
      var valor_lista = document.getElementById("form_cambiar_nombre_lista").elements[1].value;
      var valor_sin_espacioizquierdo = $.trim(valor_lista);
      document.getElementById("IdUsar1").value=valor_sin_espacioizquierdo;
      if(valor_sin_espacioizquierdo == ""){
        return false;
      }
      var url_string = window.location.href;
      var url = new URL(url_string);
      var c = url.searchParams.get("lista");
      document.getElementById("viejoNombre").value=c;

      var post_url = $(this).attr("action"); //get form action url
      var form_data = $(this).serialize(); //Encode form elements for submission
      var request_method = $(this).attr("method"); //get form GET/POST method

      $.ajax({
          url : post_url,
          type: request_method,
          data : form_data,

    }).done(function(response){
      alert(response);

       var obj=JSON.parse(response);
       if(obj.error != undefined){
         if(obj.error.indexOf("Usuario no logeado en el servidor") >= 0){
           //El usuario no esta logeado, quitar cookies e ir a inicio
           borrarCookie("login");
           borrarCookie("idSesion");
           window.location = "inicio.html";
         }
         else{
           $("#resultado_seguir").text("Ya existe la lista "+ valor_sin_espacioizquierdo+ ".");
           $("#result_seguir").attr("src","img/error.png");
         }
       }
       else{
         $("#resultado_seguir").text("El nombre de la lista se ha cambiado correctamente.");
         $("#result_seguir").attr("src","img/exito.png");
         //Ha ido bien, actualizar parametro en la URL de lista para que al cerrar ventana
         //haga reload a la direccion correcta
         updateQueryStringParam("lista",valor_sin_espacioizquierdo);
       }
       $('.button2').click();

    }).fail(function(response){
        alert("Error interno. Inténtelo más tarde.");
    });
  });
});

//Actualiza la URL de la pagina cambiando el parametro key al valor value, sin hacer reload
function updateQueryStringParam(key, value) {
  baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
  urlQueryString = document.location.search;
  var newParam = key + '=' + value,
  params = '?' + newParam;

  // If the "search" string exists, then build params from it
  if (urlQueryString) {
    keyRegex = new RegExp('([\?&])' + key + '[^&]*');
    // If param exists already, update it
    if (urlQueryString.match(keyRegex) !== null) {
      params = urlQueryString.replace(keyRegex, "$1" + newParam);
    } else { // Otherwise, add it to end of query string
      params = urlQueryString + '&' + newParam;
    }
  }
  window.history.replaceState({}, "", baseUrl + params);
}
