const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const favoriteSong = require("../models/favoriteSong");

//@route GET api/favoriteSong
//@desc Get favoriteSong
//@access Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const favoriteSongList = await favoriteSong
      .find({ user: req.userId })
      .populate({
        path: "song",
      });

    res.json({ success: true, favoriteSongList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server errorr" });
  }
});

//@route POST api/favoriteSong
//@desc POST favoriteSong
//@access Private
router.post("/", verifyToken, async (req, res) => {
  const { song } = req.body;

  try {
    const newFavoriteSong = new favoriteSong({
      user: req.userId,
      song,
    });

    await newFavoriteSong.save();

    const getFavoriteSong = await favoriteSong
      .findOne({ song })
      .populate("song");

    res.json({ success: true, getFavoriteSong });
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
