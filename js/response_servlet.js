$(function() {
  // bind 'myForm' and provide a simple callback function
  $('#form_registro').ajaxForm(function() {
      alert("Thank you for your comment!");
  });


  //$('#acceso').ajaxForm(function() {
  //    alert("Thank you for your comment!");
  //});

  $(document).on("submit", "#acceso", function(event) {
      var $form = $(this);
  
      $.post($form.attr("action"), $form.serialize(), function(response) {
          alert("Thank you for your comment!");
      });

      event.preventDefault(); // Important! Prevents submitting the form.
  });
});
