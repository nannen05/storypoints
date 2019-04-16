
const express = require('express')
const http = require('http')
const mongo = require('mongodb').MongoClient;
const socketIO = require('socket.io')

const port = 4001
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

mongo.connect('mongodb://127.0.0.1/', function(err, db){
    if(err){
      throw err;
  }

  console.log('MongoDB connected...');

  const dbase = db.db("storypoints"); //here

  io.on('connection', socket => {
    console.log('New client connected')

    const renderCards = () => {
      dbase.collection("cards").find().sort({userId: 1}).toArray(function(err, res) {
        if (err) throw err;
        console.log(res);
        io.sockets.emit('RENDER_CARDS', res)
      });
    }

    const sendCard = () => {
      socket.on('SEND_CARD', (card) => {
        dbase.collection("cards").insertOne(card, function(err, res) {
          if (err) throw err;
          io.sockets.emit('ADD_CARD', card)
          renderCards()
        });
      })
    }

    const updateCard = () => {
      socket.on('UPDATE_CARD', (card) => {
        const myQuery = { userId: card.userId };
        const newValue = { $set: {card: card.card} };
        dbase.collection("cards").updateOne(myQuery, newValue, function(err, res) {
          if (err) throw err;
          renderCards()
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

    const queryCard = () => {
      socket.on('QUERY_CARD', (card) => {
        const myQuery = { userId: card.userId };
        const newValue = { $set: {card: card.card, userId: card.userId, user: card.user} };

        dbase.collection("cards").updateOne(myQuery, newValue, {upsert: true}, function(err, res) {
          if (err) throw err;
          console.log('query')
          io.sockets.emit('ADD_CARD', card) 
        });
      })
    }

    renderCards()
    sendCard()
    updateCard()
    clearCards()
    queryCard()
  
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
})



server.listen(port, () => console.log(`Listening on port ${port}`))