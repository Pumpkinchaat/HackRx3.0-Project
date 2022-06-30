$('#exampleModal1').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('whatever') // Extract info from data-* attributes

  var modal = $(this)
  modal.find('.modal-title').text(recipient)
  if(recipient == "Sign Up"){
    modal.find('.modal-body .username').text("Unique Username")
    modal.find('.modal-body .password').text("Set Password")
    modal.find('.Save_button').text("Register")
  }
  else{
    modal.find('.modal-body .username').text("Username")
    modal.find('.modal-body .password').text("Password")
    modal.find('.Save_button').text("Submit")
  }

})

document.querySelector(".h").addEventListener("click",function(){
  const number = document.querySelector("#rating").value;
  let text = document.querySelector(".Rating").innerHTML;
  if(number>5 || number<0){
    document.querySelector(".Rating").innerHTML = "Give rating between 0-5";
    document.querySelector(".Rating").style.color = "red";
  }
});
