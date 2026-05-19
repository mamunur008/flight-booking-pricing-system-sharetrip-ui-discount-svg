import amqp from "amqplib";
let channel;
export async function connectRabbit() {
  try {
    const conn = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost",
    );
    channel = await conn.createChannel();
    await channel.assertQueue("audit.events", { durable: true });
    console.log("RabbitMQ connected");
  } catch (e) {
    console.warn("RabbitMQ unavailable, app continues:", e.message);
  }
}
export function publishAudit(event) {
  if (channel)
    channel.sendToQueue("audit.events", Buffer.from(JSON.stringify(event)), {
      persistent: true,
    });
}
