import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
let sum = 0;
io.on('connection', (socket) => {
    console.log("New client connected:" , socket.id);

    io.emit('sendMessage', "Hello from Server");

    socket.on("increment", () => {
        sum = sum +1;
        io.emit("serverSend", sum);
    })

    socket.on("reset", () => {
        sum = 0;
        io.emit("serverSend", sum);
    })
})


const port = 3001;

server.listen(port, () => {
    console.log(`SocketIO server is running on port: ${port}`);
})