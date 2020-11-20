const express=require('express');
const socketio=require('socket.io');
const http= require('http');
const app=express();
const server=http.createServer(app);
const io=socketio(server);
const {addUsers, removeUser, getUsers, getUserInRoom}=require('./Users.js');
const PORT=process.env.PORT||5000;
const router=require('./router.js');
app.use(router);
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('join', ({name, room}, callback)=>{
    const {error, user}=addUsers({id:socket.id, name, room});
    if (error) return callback(error);
    //console.log(user);
    socket.join(user.room);
    socket.emit('message', {user:'admin', text:`${user.name} welcome to the room ${user.room}`});
    socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name} joined`});
    console.log(name, room);
    
  });
  socket.on('sendMessage', (message, callback)=>{
    const user=getUsers(socket.id);
    console.log(user, message, "Sending message");
    io.to(user.room).emit('message', {user: user.name, text:message});
    callback();
  })
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUserInRoom(user.room)});
    }
  });
});
server.listen(PORT, ()=>{console.log('Server opened Sucessfully')});