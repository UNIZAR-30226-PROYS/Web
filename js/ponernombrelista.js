function nombreLista(){
  //get the input elements from HTML DOM
  var textOne = document.getElementById("prueba");
  var textTwo = document.getElementById("IdUsar1");
  //Get the value of textOne textbox input
  var textOneValue = textOne.innerHTML;

  var textTwoValue = textOneValue;
  //Assign the value of textOne textbox to textTwo textbox
  textTwo.value = textTwoValue;
}
