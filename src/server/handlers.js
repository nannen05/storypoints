const rooms = require('../config/storyboardrooms')

module.exports = function(dbase, socket) {

    function handleJoin(room, cb) {
        console.log('New User')
        socket.broadcast.to(room).emit('NEW_USER', null);
        socket.join(room)
        return cb(null, true)
    }

    function handleLeaveRoom(room, cb) {
        console.log('User Left Room')
        socket.broadcast.to(room).emit('USER_LEFT', null);
        socket.leave(room)
        return cb(null, true)
    }

    function handleGetRooms(_, cb) {
        return cb(null, rooms)
    }

    function handleRenderCards(_, cb) {
        dbase.collection("cards").find().sort({userId: 1}).toArray(function(err, res) {
            if (err) throw err;
            console.log(res);
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
