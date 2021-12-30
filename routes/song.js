const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Song = require("../Models/Song");

//@route GET api/songs
//@desc Get post
//@access Private
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json({ success: true, songs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server errorr" });
  }
});

//@route POST api/songs
//@desc Create post
//@access Private
router.post("/", async (req, res) => {
  const { name, url, img, singer } = req.body;

  try {
    const newSong = new Song({
      name,
      url,
      img,
      singer,
    });

    await newSong.save();

    res.json({
      success: true,
      message: "Thêm bài hát thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server errorr" });
  }
});

module.exports = router;
