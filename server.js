const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
// const {v4:uuid} = require('uuid');

// Create an Express application
const app = express();
const server = http.createServer(app);

// Create a Socket.IO instance
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static('public'));



// Handle socket connections
io.on('connection', (socket) => {

  console.log(`User (${socket.id}) connected`);

  //join a specific room
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room : ${roomName}`)

    //console total no of sockets in room
    const socketInRoom = io.sockets.adapter.rooms.get(roomName).size;
    console.log(`${roomName} :: Total members: ${socketInRoom}`);

    // console.log(io.sockets.adapter.rooms.get(roomName)) -->this returns socket ids in that room
  })

  //leaving the current room
  socket.on('leaveRoom', () => {
    const rooms = object.keys(socket.rooms);
    rooms.forEach((room) => {
      if(room !== socket.id){
        socket.leave(room);
        console.log(`${socket.id} user left the ${room}`)
      }
    })
  })



  // Listen for chat messages
  socket.on('chat message', (data) => {
    // Broadcast the received message with username to all connected clients
    io.emit('chat message', {username: data.username, message: data.message});
    console.log(data);
  });


  //listen for room specific chat messages
  socket.on('room chat message', (data) => {
    const {current_room, username, message} = data;
    console.log(current_room)
    io.to(current_room).emit('room chat message', {username, message})
  })


  // Handle disconnection-----------------------------------------------------
  socket.on('disconnect', (e) => {
    console.log(`User (${socket.id}) disconnected`);
  });

});

// Start the server
const port = 3003;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

