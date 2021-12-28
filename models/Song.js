const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  singer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("songs", SongSchema);
