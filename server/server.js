const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store connected users
let users = [];

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // User joins chat
  socket.on("join_chat", (username) => {
    const existingUser = users.find(
      (user) => user.id === socket.id
    );

    if (!existingUser) {
      users.push({
        id: socket.id,
        username: username,
      });
    }

    console.log("Online Users:", users);

    // Send updated users list to everyone
    io.emit("users_list", users);
  });

  // Receive and send messages
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // User disconnects
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    users = users.filter(
      (user) => user.id !== socket.id
    );

    io.emit("users_list", users);

    console.log("Remaining Users:", users);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});