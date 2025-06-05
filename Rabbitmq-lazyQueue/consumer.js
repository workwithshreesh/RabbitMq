const amqp = require("amqplib");

const receiveMessage = async () => {

    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const queueName = "lazy_notification_queue";

        await channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                "x-queue-mode": "lazy"
            }
        });

        console.log(`Waiting for messages in ${queueName}`);

        channel.consume(queueName, (message) => {
            console.log(`Recived message: ${message.content.toString()}`);
            channel.ack(message);
        })

    } catch (error){
        console.error(error)
    }

}

receiveMessage();