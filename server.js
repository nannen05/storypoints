const express = require('express')
const path = require('path');
const http = require('http')
const mongo = require('mongodb').MongoClient;
const socketIO = require('socket.io')

const handlers = require('./src/server/handlers')

require('dotenv').config();

const port = process.env.PORT || 3001;
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const dbUser = process.env.REACT_APP_DB_USER
const dbPassword = process.env.REACT_APP_DB_PASSWORD

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const uri = "mongodb+srv://" + dbUser + ":" + dbPassword + "@storypoints-6sx8y.mongodb.net/test?retryWrites=true";

mongo.connect(uri, {useNewUrlParser: true}, function(err, db){
    if(err){
      console.log(err)
      throw err;
  }

  console.log('MongoDB connected...');

  const dbase = db.db("storypoints_db");

  io.on('connection', socket => {
    
    console.log('New client connected')
    //console.log(io)

    const { 
      handleJoin,
      handleLeaveRoom,
      handleGetRooms,
      handleRenderCards
    } = handlers(dbase, socket, io);

    socket.on('JOIN', handleJoin);

    socket.on('LEAVE_ROOM', handleLeaveRoom)

    socket.on('GET_ROOMS', handleGetRooms);

    socket.on('RENDER_NEW_CARDS', handleRenderCards);

    socket.on('START_TIMER', handleTimer)

    function handleTimer(time) {
      console.log('alert timer')
      io.sockets.emit('ALERT_TIMER', time)
    }

    const updateCard = () => {
      socket.on('UPDATE_CARD', (card, room) => {
        const myQuery = { userId: card.userId, room: card.room };
        const newValue = { $set: {card: card.card, update: card.update, room: card.room} };
        dbase.collection("cards").updateOne(myQuery, newValue, function(err, res) {
          if (err) throw err;
          io.sockets.emit('ADD_CARD', card) 
          io.sockets.in(card.room).emit('USER_CHANGED_CARD', card)
          console.log('rooms', io.sockets.adapter.rooms)
        });
      })
    }

    const updateRoomTime = () => {
        socket.on('UPDATE_ROOM_TIME', (storyRoomName, time) => {
            console.log(storyRoomName, time)
            io.sockets.emit('NEWEST_ROOM_TIME', storyRoomName, time)
        })
    }

    const queryCard = () => {
      socket.on('QUERY_CARD', (card) => {
        console.log(card)
        const myQuery = { userId: card.userId, room: card.room };
        const newValue = { $set: {card: card.card, userId: card.userId, user: card.user, update: card.update, room: card.room} };

        dbase.collection("cards").updateOne(myQuery, newValue, {upsert: true}, function(err, res) {
          if (err) throw err;
          console.log('query set')
          io.sockets.emit('ADD_CARD', card) 
        });

        // dbase.collection(card.room).updateOne(myQuery, newValue, {upsert: true}, function(err, res) {
        //   if (err) throw err;
        //   //io.sockets.emit('ADD_CARD', card) 
        // });
      })
    }

    const clearCards = () => {
      socket.on('CLEAR_CARDS', (roomName) => {
        const myQuery = {room: roomName}

        dbase.collection("cards").deleteMany(myQuery, function() {
          io.sockets.in(roomName).emit('CLEAR_USER_CARD')
          io.sockets.in(roomName).emit('RERENDER_CARDS')
        })
      })
    }

    updateCard()
    updateRoomTime()
    clearCards()
    queryCard()
  
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
});

server.listen(port, () => {
  console.log('server started and listening on port ' + port);
});