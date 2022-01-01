const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  id_user: { type: String, required: true },

  name_song: { type: String, required: true },
  url_song: { type: String, required: true },
  img_song: { type: String, required: true },

  category: { type: String, required: true },
  view: { type: Number, default: 0 },
  favorite: { type: Number, default: 0 },

  name_singer: { type: String, required: true },

  cloudinary_id_img: { type: String, required: true },
  cloudinary_id_song: { type: String, required: true },
});

module.exports = mongoose.model("songs", SongSchema);
