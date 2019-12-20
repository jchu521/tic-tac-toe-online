const { Room } = require("../models/room");

//Create Room
const createRoom = async (req, res) => {
  const { roomName } = req.params;

  if (!roomName)
    return res.json({ success: false, message: "Missing romm id" });

  Room.findOne({ roomName }, (err, docs) => {
    // if (docs) {
    //   return res.json({ success: false, message: "Room name already exist." });
    // } else {
    const newRoom = new Room({
      roomName
    });

    newRoom.save();
    return res.json({ success: true, room: newRoom });
    // }
  });
};

//Delete Room
const deleteRoom = async (req, res) => {
  const { roomName } = req.params;

  if (!roomName)
    return res.json({ success: false, message: "Missing romm id" });

  Room.findOneAndDelete({ roomName }, err =>
    res.json({ success: false, message: err })
  );

  return res.json({ success: true, message: `Room ${roomName} is deleted` });
};

exports.createRoom = createRoom;
exports.deleteRoom = deleteRoom;
