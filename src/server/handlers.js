const rooms = require('../config/storyboardrooms')

module.exports = function(dbase) {

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
        handleGetRooms,
        handleRenderCards
    }
}
