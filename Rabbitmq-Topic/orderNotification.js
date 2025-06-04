const amqp = require("amqplib");

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const queue = "order_queue";

        // await channel.deleteQueue(queue);  // delete previous bindings
        // await channel.assertQueue(queue, { durable: true });

        // Setup exchange and queue
        await channel.assertExchange(exchange, "topic", { durable: true });
        await channel.assertQueue(queue, { durable: true });

        // Bind to routing key pattern
        await channel.bindQueue(queue, exchange, "order.*");

        // Start consuming from the queue
        channel.consume(queue, (message) => {
            if (message) {
                console.log("Message from subscribed user:", JSON.parse(message.content.toString()));
                channel.ack(message);
            }
        }, { noAck: false });

        console.log(`[*] Waiting for messages in queue: ${queue}. To exit press CTRL+C`);

    } catch (error) {
        console.error("Consumer Error:", error);
    }
};

receiveMessage();
