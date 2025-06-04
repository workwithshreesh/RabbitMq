const amqp = require("amqplib");


const smsNotification = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const queue = await channel.assertQueue("", {exclusive: true});
        console.log("Waiting for msgs => ", queue);

        await channel.bindQueue(queue.queue, exchange, "");


        await channel.consume(
            queue.queue, (message) => {
            if(message){
                const product = JSON.parse(message.content);
                console.log("Sending notification for product => ", product.name);
                channel.ack(message);
            }
        }, {noAck: false})

    } catch (error){
        console.error(error)
    }
}

smsNotification();