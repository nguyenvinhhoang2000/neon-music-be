const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imgAlbum: {
    type: String,
    required: true,
  },

  song: {
    type: Schema.Types.ObjectId,
    ref: "songs",
  },
});

module.exports = mongoose.model("Album", AlbumSchema);
