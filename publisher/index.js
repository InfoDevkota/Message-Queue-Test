const amqp = require('amqplib');
const axios = require('axios');

/**
 * start the publisher
 */
let start = () =>{
    amqp.connect("amqp://localhost:5672").then(connection =>{
        connection.createChannel().then(channel =>{
            channel.assertQueue("messages");
            startPublising(channel);
        })
    }).catch(error =>{
        console.error("Error establishing connection with queue");
        console.error(error.toString());
    })
}
/**
 * start sending messages to queue
 * @param {Channel} channel 
 */
let startPublising = (channel) =>{
    setInterval(() =>{
        let message = getMessage();
        // console.log(message);
        channel.sendToQueue("messages", message);
    },
        50
        // 1000
    )
}

/**
 * get message to send to queue
 * @returns {Buffer} Message as Buffer
 */
let getMessage = () =>{
    let data = {
        message: getRandomPhrase(),
        timestamp: new Date(),
        priority: getRandomNumber(1, 10)
    }
    return Buffer.from(JSON.stringify(data));
}


/**
 * returns random number between min and max
 * @param {number} min 
 * @param {number} max 
 * @returns {number} a random number
 */
let getRandomNumber = (min, max) =>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let phrases = ["test message", "test message 2"]; //let's save so we don't need to request to the server often for phreases. 

/**
 * get a message string
 * @returns {string}
 */
let getRandomPhrase = () =>{
    let index = getRandomNumber(0, phrases.length -1);
    if((index < phrases.length / 10) && phrases.length < 100) {
        //lets pull new phrase 1/10 chance
        pullRandomPhrases(phrases.length) //get one
    }
    return phrases[index];
}

/**
 * to get random phreases from web
 * @param {number} count - till phrases length be
 */
let pullRandomPhrases = (count) =>{
    // using Random Quotes generator https://github.com/tanwanimohit/quotesapi
    axios.get("https://freequote.herokuapp.com/").then(response =>{
        if(response && response.data){
            let quote = response.data.quote;
            phrases.push(quote);
            if(phrases.length <= count){
                pullRandomPhrases(count);
            }
        }
    }).catch(error =>{
        console.log("Error on getting Quotes.");
        console.log(error.toString());
    })
}

pullRandomPhrases(20);

start();
