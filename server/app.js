const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIo = require('socket.io')
const path = require('path')

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', function(socket){
    console.log("User connected:", socket.id);

    // Send a welcome message to the newly connected client
    socket.emit('chat', { username: 'Server', text: 'Welcome to the chat!' });

    socket.on('chat', function(msgObj){
        console.log("Message received:", msgObj);
        // Broadcast the message to all clients including the sender
        io.emit('chat', { username: msgObj.username, text: msgObj.text });
    });

    socket.on('disconnect', function(){
        console.log("User disconnected:", socket.id);
    });
});

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, function(){
    console.log(`Server running on port ${PORT}`);
});