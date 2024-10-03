const path = require("path");
const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const formatMessage = require("./messages");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "client")));

const port = process.env.PORT || 3000;
let users = [];
io.on("connection", (socket) => {
  console.log("Foydalanuvchi ulandi:", socket.id);

  // Foydalanuvchi chatga kirganda
  socket.on("join", ({ username }) => {
    users.push({ id: socket.id, username });
    // Foydalanuvchiga xush kelibsiz xabar
    socket.emit(
      "message",
      formatMessage("admin", `${username}  Chat App'ga xush kelibsiz!`)
    );

    // Foydalanuvchi chatga kirganini boshqalarga e'lon qilish
    socket.broadcast.emit(
      "message",
      formatMessage("Admin", `${username} chatga qo'shildi`)
    );
    io.emit("usersList", users);
    // Foydalanuvchi uzilganda
    socket.on("disconnect", () => {
      users = users.filter((user) => user.id !== socket.id);
      io.emit(
        "message",
        formatMessage("Admin", `${username} chatni tark etdi`)
      );
      io.emit("usersList", users);
    });

    // Foydalanuvchi xabar yozganda
    socket.on("chatMessage", (msg) => {
      io.emit("message", formatMessage(username, msg));
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});
