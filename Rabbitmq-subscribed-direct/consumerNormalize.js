const amqp = require("amqplib");


async function recvMail(){
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue("send_mail_to_user", {durable: false});

        channel.consume("send_mail_to_user", (message) => {
            if(message) {
                console.log("message from normal user", JSON.parse(message.content));
                channel.ack(message);
            }
        })

    } catch (error) {
        console.log(error)
    }
}

recvMail();