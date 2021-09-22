const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const server = http.createServer(app)
const { Server } = require('socket.io')
const fs = require('fs').promises

const io = new Server(server)

let messages = []

app.set(express.static(path.join(__dirname, '/public')))

app.use('/', function(req, res){
     res.sendFile(__dirname + '/public/index.html')
})

io.on('connection', (socket) => {
     console.log('A user connected');
     io.emit('chat message', messages)

     socket.on('chat message', (msg)=>{
          messages.push(msg)
          io.emit('chat message', messages)
     })

     socket.on('disconnect', ()=>{
          console.log('User disconnected');
     })
})

// Set interval to clear messages after 24 hours. To prevent overloading.
setInterval(() => {
     messages = []
}, 5000);

let port = 3000;
server.listen(port, () => console.log(`App listening at port ${port}`))