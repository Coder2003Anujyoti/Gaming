const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let players = []; // Stores connected players (max 2)

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  if (players.length < 2) {
    players.push({ id: socket.id, name: null });
    socket.emit("waitingForName"); // Ask player for name
  } else {
    socket.emit("roomFull", "Two players are already playing.");
    socket.disconnect(); // Prevent extra players
  }

  socket.on("setName", (playerName) => {
    const player = players.find(p => p.id === socket.id);
    if (player) {
      player.name = playerName;
      console.log(`${playerName} has joined the game.`);
    }

    if (players.length === 2 && players[0].name && players[1].name) {
      io.emit("gameStart", players);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    players = players.filter(player => player.id !== socket.id);
    if (players.length < 2) {
      io.emit("playerLeft", "A player has left. Waiting for a new player...");
    }
  });
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});