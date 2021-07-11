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
  socket.on('new-user', userName =>{
    users[socket.id] = userName;
  });

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    // messages
    
      //send message to the same room
     
      socket.on('message', (msg,name) => {
        io.to(roomId).emit('createmsg', msg,name)
    })

    socket.on('raise-hand', () => {
      //send raised hand emoji to the same room
      io.to(roomId).emit('raiseHand', username)
    });
    

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    });
  });
});


server.listen( process.env.PORT || 8569);

