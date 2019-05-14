import io from "socket.io-client";

let portUrl;

if(process.env.PORT) {
  portUrl = `https://protected-bastion-46350.herokuapp.com:${process.env.PORT}`
} else {
  portUrl = process.env.REACT_APP_CURRENT_URL
}

export default function () {
  console.log(portUrl)
  console.log(process.env)
  //const socket = io.connect(portUrl)
  const socket = io.connect()
  
  function queryCard(cardInfo) {
    console.log('socket query')
    socket.emit('QUERY_CARD', cardInfo)
  }

  function updateCard(cardInfo) {
    socket.emit('UPDATE_CARD', cardInfo)
  }

  function renderCards(cb) {
    socket.emit('RENDER_NEW_CARDS', null, cb)
  }

  function getRooms(cb) {
    socket.emit('GET_ROOMS', null, cb)
  }

  function join(storyRoomName, cb) {
    socket.emit('JOIN', storyRoomName, cb)
  }

  function startTimer(time) {
    socket.emit('START_TIMER', time)
  }

  return {
    socket,
    queryCard,
    updateCard,
    renderCards,
    getRooms,
    join,
    startTimer,
  }
}
