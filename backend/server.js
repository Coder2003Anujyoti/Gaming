const express = require("express");
const http = require("http");
const {v4:uuidv4}= require("uuid")
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
const rooms={};
io.on("connection",(socket)=>{
  console.log("Player with "+socket.id+" has joined");
  let assignedroom=null;
  for(const roomId in rooms){
    if(rooms[roomId].length<2){
      assignedroom=roomId;
      break;
    }
  }
  if(!assignedroom){
    assignedroom=uuidv4();
    rooms[assignedroom]=[];
  }
  rooms[assignedroom].push({id:socket.id,name:null,choice:null})
  socket.join(assignedroom)
   if(rooms[assignedroom].length==1){
io.to(assignedroom).emit("waiting","Waiting for another Player....")
  }
  if(rooms[assignedroom].length==2){
 socket.emit("setname",assignedroom)
  }
  console.log(rooms);
  socket.on('addname',(text,roomId)=>{
       const player = rooms[roomId]?.find((p) => p.id === socket.id);
      if (player) {
        player.name = text;
        console.log(`${text} joined room ${roomId}`);}
   if (rooms[roomId].length === 2 && rooms[roomId][0].name!=null && rooms[roomId][1].name!=null) {
       console.log(rooms)
        io.to(roomId).emit("gameStart", rooms[roomId]);
      }
     else{
       io.to(player.id).emit("waiting","Waiting for another Player....")
     }
  })
  socket.on('makemove',(move,roomId)=>{
    const player = rooms[roomId]?.find((p) => p.id === socket.id);
      if (player) {
        player.choice = move;
        console.log(`${player.name} chose ${move}`);
      }
        if (rooms[roomId][0].choice!=null && rooms[roomId][1].choice!=null) {
    let [playerOne, playerTwo] = rooms[roomId];
            let win = "";
            let message = "";

            if(playerOne.choice=== 'rock') {
                if(playerOne.choice=== 'rock' && playerTwo.choice=== 'scissor') {
                    message = `Player ${playerOne.name} Win!`;
                    win = playerOne.name;
                } else if(playerOne.choice === playerTwo.choice) {
                    message = `Draw!`;
                } else {
                    message = `Player ${playerTwo.name} Win!`;
                    win = playerTwo.name;
                }
            } else if(playerOne.choice === 'scissor') {
                if(playerOne.choice === 'scissor' && playerTwo.choice=== 'paper') {
                    message = `Player ${playerOne.name} Win!`;
                    win = playerOne.name;
                } else if(playerOne.choice=== playerTwo.choice) {
                    message = `Draw!`;
                } else {
                    message = `Player ${playerTwo.name} Win!`;
                    win = playerTwo.name;
                }
            } else if(playerOne.choice === 'paper') {
                if(playerOne.choice=== 'paper' && playerTwo.choice=== 'rock') {
                    message = `Player ${playerOne.name} Win!`;
                    win = playerOne.name;
                } else if(playerOne.choice === playerTwo.choice) {
                    message = `Draw!`;
                } else {
                    message = `Player ${playerTwo.name} Win!`;
                    win = playerTwo.name;
                }
            }
        io.to(roomId).emit('winner',{info:rooms[roomId],msg:message,winner:win});
       rooms[roomId].forEach((p) => (p.choice = null));
        }
  })
 socket.on("disconnect",()=>{
   console.log("User disconnected "+socket.id);
   for(const roomId in rooms){
     rooms[roomId]=rooms[roomId].filter((p)=>p.id!=socket.id)
    if(rooms[roomId].length==0){
      delete rooms[roomId];
    }
    if(rooms[roomId].length==1){
    io.to(roomId).emit("playerLeft","A player has been disconnected....")
    }
   }
 })
  
})
server.listen(8000, () => {
  console.log("Server running on port 8000");
});