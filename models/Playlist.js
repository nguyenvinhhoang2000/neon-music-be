const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  song: {
    type: Schema.Types.ObjectId,
    ref: "songs",
  },
  name_playlist: { type: String, require: true },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
