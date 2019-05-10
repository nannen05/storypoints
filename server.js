const express = require('express')
const http = require('http')
const mongo = require('mongodb').MongoClient;
const socketIO = require('socket.io')

const handlers = require('./src/server/handlers')

require('dotenv').config();

const port = 3001
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const dbUser = process.env.REACT_APP_DB_USER
const dbPassword = process.env.REACT_APP_DB_PASSWORD

const uri = "mongodb+srv://" + dbUser + ":" + dbPassword + "@storypoints-6sx8y.mongodb.net/test?retryWrites=true";

mongo.connect(uri, {useNewUrlParser: true}, function(err, db){
    if(err){
      throw err;
  }

  console.log('MongoDB connected...');

  const dbase = db.db("storypoints_db");

  io.on('connection', socket => {
    //console.log('New client connected')

    const { 
      handleJoin,
      handleGetRooms,
      handleRenderCards
    } = handlers(dbase, socket);

    socket.on('JOIN', handleJoin);

    socket.on('GET_ROOMS', handleGetRooms);

    socket.on('RENDER_NEW_CARDS', handleRenderCards);

    socket.on('START_TIMER', handleTimer)


    function handleTimer(time) {
      console.log('alert timer')
      io.sockets.emit('ALERT_TIMER', time)
    }

    const updateCard = () => {
      socket.on('UPDATE_CARD', (card) => {
        const myQuery = { userId: card.userId };
        const newValue = { $set: {card: card.card} };
        dbase.collection("cards").updateOne(myQuery, newValue, function(err, res) {
          if (err) throw err;
          //renderCards()
          io.sockets.emit('ADD_CARD', card) 
        });
      })
    }

    const queryCard = () => {
      socket.on('QUERY_CARD', (card) => {
        console.log('query')
        const myQuery = { userId: card.userId };
        const newValue = { $set: {card: card.card, userId: card.userId, user: card.user} };

        dbase.collection("cards").updateOne(myQuery, newValue, {upsert: true}, function(err, res) {
          if (err) throw err;
          console.log('query')
          io.sockets.emit('ADD_CARD', card) 
        });
      })
    }

    const clearCards = () => {
      socket.on('CLEAR_CARDS', () => {
        dbase.collection("cards").deleteMany({}, function() {
          io.sockets.emit('CLEAR_USER_CARD')
        })
      })
    }

    updateCard()
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