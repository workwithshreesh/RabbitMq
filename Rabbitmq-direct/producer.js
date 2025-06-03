const amqp = require("amqplib");

async function sendMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "mail_exchange";
        const routingKey = "send_mail";

        const message = {
            to: "fakemy159@gmail.com",
            from: "hello@gmail.com",
            subject: "Hello Tp mail",
            body: "Hello shreesh!!"
        }

        await channel.assertExchange(exchange, "direct", {durable: false});
        await channel.assertQueue("mail_queue", {durable: false});

        await channel.bindQueue("mail_queue", exchange, routingKey);
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        console.log("Mail data sent", message);

        setTimeout(() => {
            connection.close();
        }, 500)

    } catch(error){
        console.log(error)
    }
}

sendMail();