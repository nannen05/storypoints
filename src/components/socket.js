import io from "socket.io-client";

export default function () {
  const socket = io.connect('http://127.0.0.1:3001')

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

  return {
    queryCard,
    updateCard,
    renderCards,
    getRooms,
    join
  }
}
