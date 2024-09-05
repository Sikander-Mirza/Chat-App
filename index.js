const express = require('express');
const { createServer } = require('http');
const path = require("path");
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Broadcast to all users that a new user has joined
  socket.broadcast.emit('message', 'A new user has joined the chat');

  // Listen for chat messages
  socket.on("message", (message) => {
    console.log('Received message from client:', message);
    io.emit("message", message); // Broadcast the message to all connected clients
  });

  // Notify users when a user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    io.emit('message', 'A user has left the chat');
  });
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  return res.sendFile(path.resolve("./public/index.html"));
});

server.listen(9000, () => {
  console.log('Server running at http://localhost:9000');
});
