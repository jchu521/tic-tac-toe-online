const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room");

//POST
// /room/:roomName
router
  .post("/:roomName", roomController.createRoom)
  .delete("/:roomName", roomController.deleteRoom);

module.exports = router;
