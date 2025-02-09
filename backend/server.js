
const express      = require("express");
const app          = express();
const port         = 8000;

const server = app.listen(`${port}`, () => {
    console.log(`Server started on port ${port}`);
});

const io = require('socket.io')(server, {
    cors: { origin: '*' }
});
let picks = [];


let matchWinDeterminer = (firstPicked, secondPicked) => {

};

io.on('connection', (socket) => {
    console.log('player connected');

    socket.on('picked', (data) => {

        picks.push({
            name : data.player,
            picked : data.picked
        });

        if(picks.length ==2){
            // push result
            // Get the result.
            let [playerOne, playerTwo] = picks;
            let win = "";
            let message = "";

            if(playerOne.picked === 'rock') {
                if(playerOne.picked === 'rock' && playerTwo.picked === 'scissor') {
                    message = `Player ${playerOne.name} Win!`;
                    win = playerOne.name;
                } else if(playerOne.picked === playerTwo.picked) {
                    message = `Draw!`;
                } else {
                    message = `Player ${playerTwo.name} Win!`;
                    win = playerTwo.name;
                }
            } else if(playerOne.picked === 'scissor') {
                if(playerOne.picked === 'scissor' && playerTwo.picked === 'paper') {
                    message = `Player ${playerOne.name} Win!`;
                    win = playerOne.name;
                } else if(playerOne.picked === playerTwo.picked) {
                    message = `Draw!`;
                } else {
                    message = `Player ${playerTwo.name} Win!`;
                    win = playerTwo.name;
                }
            } else if(playerOne.picked === 'paper') {
                if(playerOne.picked === 'paper' && playerTwo.picked === 'rock') {
                    message = `Player ${playerOne.name} Win!`;
                    win = playerOne.name;
                } else if(playerOne.picked === playerTwo.picked) {
                    message = `Draw!`;
                } else {
                    message = `Player ${playerTwo.name} Win!`;
                    win = playerTwo.name;
                }
            }

            let result = {
                message,
                picks,
                winner : win.toUpperCase(),
            };

            io.emit('result', result);
            picks = [];
        }
    });

    socket.on('disconnect', () => {
        console.log('player disconnected');
        picks = [];
    });

});