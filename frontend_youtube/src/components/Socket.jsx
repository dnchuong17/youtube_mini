import React, {useState} from 'react';
import { io } from 'socket.io-client';

const BASE_URL_SOCKET = import.meta.env.VITE_BE_URL_SOCKET;
const socket = io(BASE_URL_SOCKET, {
    withCredentials: true
});

const Socket = () => {
    const [count, setCount] = useState(0);
    socket.emit('send-message');

    socket.on('sendMessage', (data) => {
        console.log(data);
    })
    const Increment = () => {
        socket.emit('increment');
    }

    const Reset = () => {
        socket.emit('reset');
    }

    socket.on('serverSend', (data) => {
        console.log(data);
        setCount(data);
    })


    return (
        <div>
            <h1> Counter </h1>
            <h2> {count} </h2>
            <button onClick={Increment}>Add</button>
            <button>Minor</button>
            <button onClick={Reset}>Reset</button>

        </div>
    );
};

export default Socket;
