import amqp from "amqplib";

export async function publish(queue, message) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  setTimeout(() => conn.close(), 500);
}
