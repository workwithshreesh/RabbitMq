const amqp = require("amqplib");

const receiveMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "delayed_message";
        const queue = "delayed_order_update_queue";

        await channel.assertQueue(queue, { durable: true });

        channel.consume(queue, async (msg) => {
            if(msg){
                const { batchId, orders } = JSON.parse(msg.content.toString());
                console.log("Processing order update task");

                await updateOrderStatus(batchId);

                channel.ack(msg);
            }
        }, 
    {noAck: false}
    )

    } catch (error) {
        console.error(error);
    }
}


function updateOrderStatus(batchId){
    // simulate the order status update
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Processing order update task:");
            console.log("Batch ID:", batchId);
            resolve();    
        }, 1000); // simulate time taken to update order statuses
    });
}

receiveMessage();