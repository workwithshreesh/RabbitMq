const amqp = require("amqplib");

const commentsLikeNotification = async () => {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });
        const queue = await channel.assertQueue("", { exclusive: true });

        await channel.bindQueue(queue.queue, exchange, "", { 'x-match': 'any', 'notification-type': 'like', 'content-type': 'vlog'});

        channel.consume(queue.queue, (message) => {
            if(message){
                console.log("Somone is commented", message.content.toString());
                channel.ack(message);
            }
        })

    } catch(error) {
        console.error(error)
    }
}

commentsLikeNotification();