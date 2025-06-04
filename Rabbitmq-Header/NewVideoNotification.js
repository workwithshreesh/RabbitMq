const amqp = require('amqplib');

const newVideoNotification = async (headers, message) => {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable:true });
        const queue = await channel.assertQueue("", { exclusive: true });


        await channel.bindQueue(queue.queue, exchange, "", { 'x-match':'all', "notification-type": 'new_video', 'content-type': 'video'});

        channel.consume(queue.queue, (message) => {
            if(message){
                console.log("New video is uploaded", message.content.toString());
                channel.ack(message);
            }
        }, {noAck: false})

    } catch (error) {
        console.error(error)
    }
}

newVideoNotification();