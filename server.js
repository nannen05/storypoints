
//const express = require('express')
const http = require('http')
const mongo = require('mongodb').MongoClient;
const socketIO = require('socket.io')

require('dotenv').config();

const port = process.env.PORT || 4001
//const app = express()
//const path = require('path');
//const server = http.createServer(app).listen(port)
//const io = socketIO(server, { transports: ['websocket'] } )
//const io = socketIO(server)

var express = require('express'),
    app = http.createServer(express()),
    io = require('socket.io').listen(app);

const dbUser = process.env.REACT_APP_DB_USER
const dbPassword = process.env.REACT_APP_DB_PASSWORD

const uri = "mongodb+srv://" + dbUser + ":" + dbPassword + "@storypoints-6sx8y.mongodb.net/test?retryWrites=true";

//Static file declaration
// app.use(express.static(path.join(__dirname, 'client/build')));

// //production mode
// if(process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'client/build')));
//   //
//   app.get('*', (req, res) => {
//     res.sendfile(path.join(__dirname = 'client/build/index.html'));
//   })
// }
// //build mode
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/public/index.html'));
// })


mongo.connect(uri, {useNewUrlParser: true}, function(err, db){
    if(err){
      throw err;
  }

  console.log('MongoDB connected...');

  const dbase = db.db("storypoints_db");

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  console.log("Express server listening on port %d in %s mode", app.address().port, )
})
