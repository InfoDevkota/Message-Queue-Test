const amqp = require('amqplib');
const http = require('http');

const socket = require('./socket');

/**
 * start the consumer
 */
let start = () =>{
    amqp.connect("amqp://localhost:5672").then(connection =>{
        connection.createChannel().then(channel =>{
            channel.assertQueue("messages");
            channel.consume("messages", message =>{
                let data = JSON.parse(message.content.toString());
                // forwardMessage(data);

                if(data.priority >= 7){
                    forwardMessage(data);
                    channel.ack(message);
                }
            })
        })
    }).catch(error =>{
        console.error("Error establishing connection with queue");
        console.error(error.toString());
    })
}

/**
 * push to socket io
 * @param {Object} data 
 */
let forwardMessage = (data)=>{
    // console.log(data);
    socket.getIO().emit("message", data);
}

let server = http.createServer((req, res)=>{
    res.end("Hi, there.")
})

socket.init(server);

server.listen(8080);
console.log("consumer listining at 8080");

start();