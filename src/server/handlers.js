const rooms = require('../config/storyboardrooms')

module.exports = function(dbase, socket, io) {

    function handleJoin(room, cb) {
        console.log('New User')
        socket.join(room)
        io.sockets.in(room).emit('NEW_USER', null);
        return cb(null, true)
    }

    function handleLeaveRoom(room, cb) {
        console.log('User Left Room')
        io.sockets.in(room).emit('USER_LEFT', null);
        socket.leave(room, function (err) {
            console.log(err); // display null
            console.log(socket.adapter.rooms);  // display the same list of rooms the specified room is still there
         });
        
        return cb(null, true)
    }

    function handleGetRooms(_, cb) {
        return cb(null, rooms)
    }

    function handleRenderCards(_, cb) {
        dbase.collection("cards").find().sort({userId: 1}).toArray(function(err, res) {
            if (err) throw err;
            //console.log('renderCards', res);
            return cb(null, res)
        });
    }

    return {
        handleJoin,
        handleLeaveRoom,
        handleGetRooms,
        handleRenderCards
    }
}
