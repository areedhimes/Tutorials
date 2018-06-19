const numberInput = document.getElementById('number'),
  textInput = document.getElementById('msg'),
  button = document.getElementById('button'),
  response = document.querySelector('.response');

button.addEventListener('click', send, false);

const socket = io();
socket.on('smsStatus', function (data) {
  response.innerHTML = '<h5>Text message sent to ' + data.number + '</h5>';
})

function send() {
  console.log('send');
  //remove all non-numeric from the number field
  const number = numberInput.value.replace(/\D/g, '');

  //grab the text message
  const text = textInput.value;

  //need to send req to the server... 
  fetch('/', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    //create json object with number and text message
    body: JSON.stringify({ number: number, text: text })
  })
    //catch the promise from the nexmo server... .log it
    .then(function (res) {
      console.log(res);
    })
    //log any error...
    .catch(function (err) {
      console.log(err);
    });
}