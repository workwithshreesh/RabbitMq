const amqp = require("amqplib");

const reciveMessage = async () => {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "priority_exchange";
        const queue = "priority_queue";
        const routingKey = "priority_key";

        await channel.assertQueue(queue, {
            durable: true,
            arguments: { "x-max-priority": 10 }
        });

        console.log(`Waiting for message ${queue}. To exit press CTRL+C`);

        channel.consume(queue, (msg) => {
            if(msg){
                console.log(`Recived: ${msg.content.toString()}`);
                channel.ack(msg);
            }
        })

    } catch (error){
        console.error(error);
    }
}

reciveMessage();