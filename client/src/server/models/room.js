const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  roomName: {
    type: String
  }
});

const Room = mongoose.model("Room", roomSchema);

exports.Room = Room;
