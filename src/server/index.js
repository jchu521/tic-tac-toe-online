const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "../../build")));

// This is what the socket.io syntax is like, we will work this later
io.on("connection", socket => {
  console.log("User connected");

  /**
   * Create a new game room and notify the creator of game.
   */
  socket.on("createGame", function(data) {
    socket.join(data.roomName);
    socket.emit("player1", { message: "waiting for player join..." });
  });

  /**
   * Connect the Player 2 to the room he requested. Show error if room full.
   */
  socket.on("joinGame", function(data) {
    //check room exist
    var room = io.nsps["/"].adapter.rooms[data.roomName];
    //Only one player in room
    if (room && room.length == 1) {
      socket.join(data.roomName);
      socket.broadcast.to(data.roomName).emit("player1", { joined: true });
      socket.emit("player2");
      console.log(io.nsps["/"].adapter.rooms[data.roomName]);
    } else {
      console.log("Fail");

      socket.emit("err", {
        message: "Sorry, The room is full!"
      });
    }
  });

  /**
   * Handle the turn played by either player and notify the other.
   */
  socket.on("playTurn", function(data) {
    if (data.mark === "O") {
      socket.broadcast.to(data.roomName).emit("player1 turn", {
        message: "waiting "
      });
      socket.broadcast.to(data.roomName).emit("player2 turn", {
        message: "Your Turn"
      });
    } else {
      socket.broadcast.to(data.roomName).emit("player1 turn", {
        message: "Your Turn"
      });
      socket.broadcast.to(data.roomName).emit("player2 turn", {
        message: "waiting "
      });
    }

    socket.broadcast.to(data.roomName).emit("turnPlayed", {
      newBoard: data.newBoard,
      mark: data.mark
    });
  });

  socket.on("play again", data => {
    socket.emit("restart", { board: data.board });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("user disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
