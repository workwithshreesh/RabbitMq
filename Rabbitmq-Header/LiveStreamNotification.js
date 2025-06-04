const amqp = require("amqplib");

const liveStreamNotification = async () => {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const queue = await channel.assertQueue("", { exclusive: true  });

        await channel.bindQueue(queue.queue, exchange, "", { 'x-match':'all', 'notification-type': 'live_stream', 'content-type': 'gaming'});

        channel.consume(queue.queue, (message) => {
            if(message){
                console.log("Live stream started => ", message.content.toString());
                channel.ack(message)
            }
        })

    } catch (error) {
        console.error(error)
    }
}

liveStreamNotification();