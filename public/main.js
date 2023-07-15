// Establish a socket connection
const socket = io();
console.log('connection stablished')

//sending and displaying username in messages
const h3 = document.createElement('h3');
let username = '';

while (username === '') {
    username = prompt('please enter your name : ');
}

//displaying username in heading
const div = document.getElementById('username');
const user_name = document.createElement('h2');

user_name.textContent = 'username : ' + username;
div.appendChild(user_name);

//constants for room-form
const joinRoomForm = document.getElementById('joinRoomForm');
const roomInput = document.getElementById('roomInput');

const roomMessageInputForm = document.getElementById('room-chat-form');

let current_room = '';

//join room
joinRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roomName = roomInput.value.trim();
    current_room = roomName;

    if(roomName){
        socket.emit('joinRoom', roomName);
        roomInput.value = '';

        const roomMessageBox = document.createElement('input');
        const roomMessageButton = document.createElement('button');
        roomMessageButton.textContent = 'send message to ' + roomName;

        roomMessageBox.setAttribute("id", "room-input-message");
        roomMessageInputForm.appendChild(roomMessageBox);
        roomMessageInputForm.appendChild(roomMessageButton);


    }
})
//leaving room
const leaveRoom = () => {
    socket.emit('leaveRoom');
}


// Handle chat-form submission
const form = document.getElementById('chat-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('input-message');
    const message = input.value.trim();
    if (message) {
        // Send the message to the server
        socket.emit('chat message', {username, message});
        input.value = '';
    }
});


// Receive and display messages
const messages = document.getElementById('messages');
socket.on('chat message', (data) => {
    const li = document.createElement('li');
    li.textContent = `${data.username} : ${data.message}`;
    messages.appendChild(li);
});


//handle room chat form submission
const roomForm = document.getElementById('room-chat-form');
roomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('room-input-message');
    const message = input.value.trim();
    if (message) {
        // Send the message to the server
        socket.emit('room chat message', {current_room, username, message});
        input.value = '';
        console.log({current_room, username, message})
    }
});

//listen for incoming room chat messages
socket.on('room chat message', (data) => {
    const roomMessages = document.getElementById('room-messages');
    const li = document.createElement('li');
    li.textContent = `${data.username} : ${data.message}`;
    roomMessages.appendChild(li);
})