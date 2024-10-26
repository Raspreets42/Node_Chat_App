const socket = io('http://localhost:9000');

const form = document.getElementById('sending-message');
const messageInput = document.getElementById('inputmessage');
const messageContainer = document.querySelector('.container');
var audio = new Audio('../media/ting.mp3');


var name = prompt("Enter your Name to join : ");
if (name === "null" || name == '') {
    name = 'Guest';
}
socket.emit('new-user-joined', name)

const append_while_user_joins_or_leaves = (msg, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = msg;
    messageElement.classList.add('joining');
    messageElement.classList.add(position);
    messageContainer.appendChild(messageElement);
    if (position === 'left') {
        audio.play();
    }
}

const append_while_user_sends_message = (msg, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = msg;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.appendChild(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message === '') {
        swal({
            icon: 'error',
            title: 'OOPS !',
            text: 'Please Enter some Message...',
            timer: 3000
        });
    } else {
        append_while_user_sends_message(`You: ${message}`, 'right');
        socket.emit('send-message', message);
        messageInput.value = "";
    }
})

socket.on('user-joined', name => {
    append_while_user_joins_or_leaves(`${name} joined the chat`, 'right');
})

socket.on('receive', message => {
    append_while_user_sends_message(`${message.name} : ${message.message}`, 'left');
})

socket.on('left', name => {
    append_while_user_joins_or_leaves(`${name} left the chat`, 'right');
})