const mongoose = require("mongoose");

var dbURI = `mongodb://localhost:27017/tictactoe`;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to mLab `))
  .catch(() => console.error("could not connect to mLab"));

var conn = mongoose.connection;

module.exports = conn;
