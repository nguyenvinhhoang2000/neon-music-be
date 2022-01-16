const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Playlist = require("../models/Playlist");

//@route GET api/playlist
//@desc Get playlist
//@access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const playlist = await Playlist.find({ user: req.userId }).populate({
      path: "song",
    });

    res.json({ success: true, playlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server errorr" });
  }
});

//@route POST api/favoriteSong
//@desc POST favoriteSong
//@access Private
router.post("/", verifyToken, async (req, res) => {
  const { song, name_playlist } = req.body;

  try {
    const newPlaylist = new Playlist({
      user: req.userId,
      song,
      name_playlist,
    });

    await newPlaylist.save();

    res.json({ success: true, message: "Thêm thành công!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server errorr" });
  }
});

//@route DELETE api/favoriteSong
//@desc Delele favoriteSong
//@access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const songDeleteCondition = { song: req.params.id, user: req.userId };
    const deleteSong = await favoriteSong.findOneAndDelete(songDeleteCondition);

    //User not authorised or post not found
    if (!deleteSong)
      return res.status(401).json({
        success: false,
        message: "Song not found or user not authorised",
      });

    res.json({ success: true, favoriteSong: deleteSong });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server errorr" });
  }
});

module.exports = router;
