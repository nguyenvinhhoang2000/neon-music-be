const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSongSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  song: {
    type: Schema.Types.ObjectId,
    ref: "songs",
  },
});

module.exports = mongoose.model("favoriteSong", favoriteSongSchema);
