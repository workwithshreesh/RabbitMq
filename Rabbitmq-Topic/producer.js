const amqp = require("amqplib");


async function orderAndPaymentSystem(routingKey, message){
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const echnageType = "topic";

        await channel.assertExchange(exchange, routingKey, { durable: true });
        
        console.log(" [x] Sent '%s':'%s'", routingKey, JSON.stringify(message.content))

    } catch (error){

    }
}