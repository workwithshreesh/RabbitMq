const amqp = require("amqplib");

async function recvMail() {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue("send_mail_to_subscriber", {durable: false});

        channel.consume("send_mail_to_subscriber", (message) => {
            if(message){
                console.log("Message from subscribed user",JSON.parse(message.content));
                channel.ack(message)
            }
        })

    } catch (error) {
        console.log(error)
    }
}

recvMail();