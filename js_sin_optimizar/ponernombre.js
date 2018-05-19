function set_nombre(){
  //get the input elements from HTML DOM
  var textOne = document.getElementById("idNombre");
  var textTwo = document.getElementById("IdUsar1");
  //Get the value of textOne textbox input
  var textOneValue = textOne.value;

  var textTwoValue = textOneValue;
  //Assign the value of textOne textbox to textTwo textbox
  textTwo.value = textTwoValue;
}
