


import http from 'http';
import express from 'express';
import cors from "cors";
import socketio from 'socket.io';
import morgan from 'morgan';
import device from 'express-device';


import { addUser, removeUser, getUser, getUsersInRoom } from './users';

import router from './chat-router';

let chatApp = express();
let chatServer = http.createServer(chatApp);
let io = socketio(chatServer);


let chatPort = process.env.CHAT_PORT;


chatApp.use(cors());
chatApp.use(router);

chatApp.use(morgan('dev'));
chatApp.use(device.capture());



io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    console.log('Join korsi')
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    console.log('sendMessage korsi')

    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  })
});

chatServer.listen(chatPort || 9000, () => console.log(`Chat Server has started on port: ${chatPort || 9000}`));