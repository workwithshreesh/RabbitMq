const amqp = require("amqplib");


const smsNotification2 = async () => {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchnageType = "fanout";

        await channel.assertExchange(exchange, exchnageType, { durable: true });

        const queue = await channel.assertQueue("", { exclusive: true });
        console.log("Waiting for msg =>", queue);

        await channel.bindQueue(queue.queue, exchange, "");

        await channel.consume(queue.queue, (message) => {
            if(message) {
                const product = JSON.parse(message.content);
                console.log("Sending a notification 2 =>", product.name);
                channel.ack(message);
            }
        }, {noAck: false})

    } catch (error) {
        console.error(error)
    }
}

smsNotification2();