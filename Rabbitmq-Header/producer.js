const amqp = require("amqplib");

const sendNotification = async (headers, message) => {
    try {

        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        channel.publish(exchange, "", Buffer.from(message), { persistent: true, headers });

        console.log("Sent notification with headers");

        setTimeout(() => {
            connection.close()
        }, 500);

    } catch (error) {
        console.error(error);
    }
}

sendNotification({ 'x-match':'all', "notification-type": 'new_video', 'content-type': 'video'}, "new music video update");
sendNotification({ 'x-match':'all', 'notification-type': 'live_stream', 'content-type': 'gaming'}, "Gaming live stream started");
sendNotification({ 'x-match': 'all', 'notification-type': 'vlog', 'content-type': 'video'}, "New vlog video");
sendNotification({ 'x-match': 'any', 'notification-type': 'like', 'content-type': 'vlog'}, 'New comment on your vlog');
