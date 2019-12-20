const express = require("express");
const path = require("path");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;

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
    } else {
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
