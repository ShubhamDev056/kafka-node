// server.js
const express = require("express");
const http = require("http");
const { Kafka } = require("kafkajs");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const kafkaBroker = process.env.KAFKA_BROKER || "localhost:9092"; // Default to localhost if not set
//const kafka = new Kafka({ brokers: [kafkaBroker] });
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"], // Use the service name of Kafka in Docker network
  connectionTimeout: 3000,
  retry: {
    retries: 2, // Retry up to 10 times
    initialRetryTime: 3000,
  },
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "notification-group" });

app.use(cors());
app.use(express.json());

// Kafka producer and consumer setup
const runKafka = async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: "notifications", fromBeginning: true });

  consumer.run({
    eachMessage: async ({ message }) => {
      const msg = message.value.toString();
      io.emit("notification", msg); // Broadcast the message to all connected clients
    },
  });
};

app.get("/", (req, res) => {
  res.send("app");
});

// Endpoint to like a post
app.post("/like", async (req, res) => {
  const { postId, userId } = req.body;
  const message = {
    postId,
    userId,
    action: "like",
    text: `User ${userId} liked post #${postId}`,
  };

  // Send a notification message to Kafka
  await producer.send({
    topic: "notifications",
    messages: [{ value: JSON.stringify(message) }],
  });

  res.sendStatus(200);
});

runKafka().catch(console.error);

server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
