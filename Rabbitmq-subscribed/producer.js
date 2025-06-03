const amqp = require("amqplib");

async function sendMail(){

    try {

    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "mail_exchange";
    const routingKeyForSubscriber = "send_mail_to_subscriber"
    const routingKeyForNormalUser = "send_mail_to_user"

    const message = {
        to: "realtime@gmail.com",
        from: "harish@gmail.com",
        subject: "Thank You !!!",
        body: "Hello ABC !!!"
    }

    await channel.assertExchange(exchange, "direct", { durable: false });


    await channel.assertQueue("send_mail_to_subscriber", {durable: false});
    await channel.assertQueue("send_mail_to_user", { durable: false });

    await channel.bindQueue("send_mail_to_subscriber", exchange, routingKeyForSubscriber);
    await channel.bindQueue("send_mail_to_user", exchange, routingKeyForNormalUser);

    channel.publish(exchange, routingKeyForSubscriber, Buffer.from(JSON.stringify(message)));
    channel.publish(exchange, routingKeyForNormalUser, Buffer.from(JSON.stringify(message)));
    console.log("Mail data sent", message);

    setTimeout(() => {
        connection.close();
    }, 500);

    } catch (error) {
        console.log(error);
    }

}

sendMail();