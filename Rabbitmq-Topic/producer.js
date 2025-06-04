const amqp = require("amqplib");

async function orderAndPaymentSystem(routingKey, message) {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const exchangeType = "topic";
        // const queue = "order_queue";

        // await channel.deleteQueue(queue);
        // await channel.assertQueue(queue, { durable: true });


        await channel.assertExchange(exchange, exchangeType, { durable: true });

        // Publish message
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));

        console.log(" [x] Sent '%s':'%s'", routingKey, JSON.stringify(message));
        console.log(`Message was sent with routing key: ${routingKey} and content: ${JSON.stringify(message)}`);

        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        console.error("Error", error);
    }
}

// Example calls
orderAndPaymentSystem("order.payment", { orderId: 12345, status: "placed" });
orderAndPaymentSystem("payment.processed", { paymentId: 67890, status: "processed" });
