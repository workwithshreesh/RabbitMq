const amqp = require("amqplib")


const sendNotification = async (batchId, orders, delay) => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "delayed_message";
        await channel.assertExchange(exchange, 'x-delayed-message', {
            arguments: {"x-delayed-type":"direct"}
        });

        const queue = "delayed_order_update_queue";
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, "");

        const message = JSON.stringify({ batchId: orders });
        channel.publish(exchange, "", Buffer.from(message), {
            headers: {"x-delay": delay}
        });

        console.log(
            `Sent batch ${batchId} update task to delayed queue with ${delay} ms delay`
        );

        await channel.close();
        await connection.close();

    } catch (error){
        console.error(error);
    }
}


async function processBatchOrders(){
    // batch processing
    const batchId = genarateBatchId();
    const orders = collectOrdersForBatch();

    console.log(
        `Processing batch ${batchId} with orders: ${JSON.stringify(orders)}`
    );

    // update inventory, genarate shiping labels etc.
    await processOrders(orders);

    // send delayed queue message to update the oprder status
    const delay = 1000;
    sendNotification(batchId, orders, delay);
}


function genarateBatchId(){
    return "batch-" + Date.now()
}

function collectOrdersForBatch() {

    return [
        {orderId: 1, item: "Laptop", quantity: 1},
        {orderId: 2, item: "Phone", quantity: 2}
    ]

}


async function processOrders(orders) {
    console.log("🛠️ Processing orders:", orders);
    // simulate processing delay
    return new Promise((res) => setTimeout(res, 1000));
}



processBatchOrders();
