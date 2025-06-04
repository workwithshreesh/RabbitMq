const amqp = require("amqplib");

const announcedNewProduct = async (product) => {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const message = JSON.stringify(product);

        channel.publish(exchange, "", Buffer.from(message), { persistent: true });
        console.log(" Sent =>", message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error){
        console.error(error)
    }
}

announcedNewProduct({id:"123", name: "iPhone 19 pro max", price: 200000});
