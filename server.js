const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())

const server = require('http').Server(app)
const io = require('socket.io')(server)

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')


app.use('/peerjs', peerServer);


app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
});

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
});

const users = {};

io.on('connection', socket => {

  // Storing the name of user
  socket.on('new-user', username =>{
    users[socket.id] = username;
  });

  socket.on('join-room', (roomId, userId, username) => {
    
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId, username);
    // messages
    
      //send message to the same room from one user to other

     
      socket.on('message', (msg,username) => {
        io.to(roomId).emit('createmsg', msg,username)
    })

    socket.on('raise-hand', (username) => {
      //raise hand emoji for the person in the same room
      io.to(roomId).emit('raiseHand',username)
    });
    
      // Disconnectiong the user
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId, username)
    });
  });
});


server.listen( process.env.PORT || 8569);

