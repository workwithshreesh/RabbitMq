const amqp = require("amqplib");

const sendNotification = async (message) => {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchangeName = "notification_exchange";
        const queueName = "lazy_notification_queue";
        const routingKey = "notification.key";

        await channel.assertExchange(exchangeName, "direct", { durable:true });

        await channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                "x-queue-mode": "lazy"
            }
        });

        await channel.bindQueue(queueName, exchangeName, routingKey);

        channel.publish(exchangeName, routingKey, Buffer.from(message), {
            persistent: true
        });

        console.log(`Message sent: ${message}`);

        await channel.close();
        await connection.close();

    } catch (error){
        console.error(error)
    }
}


sendNotification("Hello fro producer")