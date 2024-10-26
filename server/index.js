const io = require('socket.io')(9000, {
    cors: {
        origin: '*'
    }
});

console.log("Connected");

const users = {};

io.on('connection', socket => {
    // new-user-joined event
    socket.on('new-user-joined', name => {          // when new user joins
        console.log(name, " Joined");
        users[socket.id] = name;                    // initialize id and name in users array data
        socket.broadcast.emit('user-joined', name);  // will broadcast if any user joins
    });

    //send-message event
    socket.on('send-message', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    //user-leaving event
    socket.on('disconnect', name => {                 // when new user leaves
        console.log(users[socket.id], " Left");
        socket.broadcast.emit('left', users[socket.id]);     // will broadcast if any user leaves the chat
        delete users[socket.id];
    });

});