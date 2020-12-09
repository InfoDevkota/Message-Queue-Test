const socket = require('socket.io');

let io;

/**
 * 
 * @param {Object} server server from httpcreateserver 
 */
module.exports.init = (server) =>{
    io = socket(server, { cors: { origin: '*' } });

    io.on('connection', socket =>{
        console.log("A client Connected.");
        socket.emit("connected", {message: "yes"})
    })
}

module.exports.getIO = () =>{
    if(io){
        return io;
    } else {
        console.error("Socket Io not initialized");
    }
}