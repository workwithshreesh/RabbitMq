const amqp = require("amqplib");

const receiveMessage = async () => {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const queue = "payment_queue";

        // await channel.deleteQueue(queue);  // delete previous bindings
        // await channel.assertQueue(queue, { durable: true });


        await channel.assertExchange(exchange, "topic", { durable: true });
        await channel.assertQueue(queue, { durable: true });

        await channel.bindQueue(queue, exchange, "payment.*");

        channel.consume(queue, (message) => {
            if (message) {
                console.log("Message from subscribed user:", JSON.parse(message.content.toString()));
                channel.ack(message);
            }
        }, { noAck: false });

    } catch (error) {
        console.error(error);
    }
}

receiveMessage();