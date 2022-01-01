const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
// const uploadSong = require("../utils/songmulter");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

const Song = require("../Models/Song");

//@route GET api/songs
//@desc Get song
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

//@route POST api/songs/upload
//@desc Create song
//@access Private
router.post(
  "/upload",
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "img_song", maxCount: 1 },
  ]),
  verifyToken,
  async (req, res) => {
    const { name_song, category, name_singer } = req.body;

    try {
      const resultSong = await cloudinary.uploader.upload(
        req.files.song[0].path,
        {
          resource_type: "video",
          folder: "AudioUploads",
        }
      );

      const resultImg = await cloudinary.uploader.upload(
        req.files.img_song[0].path,
        {
          folder: "SongImg",
        }
      );

      const newSong = new Song({
        id_user: req.userId,

        name_song,
        url_song: resultSong.secure_url,
        cloudinary_id_song: resultSong.public_id,
        img_song: resultImg.secure_url,
        cloudinary_id_img: resultImg.public_id,

        name_singer,
        category,
      });

      await newSong.save();

      res.json({
        success: true,
        message: "Thêm bài hát thành công",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
    }
  }
);

//@route PUT api/songs/upload/:id
//@desc Create song
//@access Private
router.put(
  "/upload/:id",
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "img_song", maxCount: 1 },
  ]),
  verifyToken,
  async (req, res) => {
    const { name_song, category, name_singer } = req.body;

    try {
      let song = await Song.findById({
        id_user: req.userId,
        _id: req.params.id,
      });

      if (!song) {
        res
          .status(400)
          .json({ success: false, message: "Không tìm thấy bài hát" });
      }

      if (Object.getOwnPropertyNames(req.files).length === 0) {
        const data = {
          name_song: name_song || song.name_song,
          category: category || song.category,
          name_singer: name_singer || song.name_singer,
        };

        await Song.findByIdAndUpdate(req.params.id, data, { new: true });
      } else {
        //check song or img or all
        if (req.files.song === undefined) {
          //change img
          await cloudinary.uploader.destroy(song.cloudinary_id_img);
          const resultImg = await cloudinary.uploader.upload(
            req.files.img_song[0].path,
            {
              folder: "SongImg",
            }
          );

          const data = {
            name_song: name_song || song.name_song,
            img_song: resultImg.secure_url || song.img_song,
            cloudinary_id_img: resultImg.public_id || song.cloudinary_id_img,
            category: category || song.category,
            name_singer: name_singer || song.name_singer,
          };

          await Song.findByIdAndUpdate(req.params.id, data, { new: true });
        } else if (req.files.img_song === undefined) {
          //change song
          await cloudinary.uploader.destroy(song.cloudinary_id_song, {
            resource_type: "video",
          });
          const resultSong = await cloudinary.uploader.upload(
            req.files.song[0].path,
            {
              resource_type: "video",
              folder: "AudioUploads",
            }
          );

          const data = {
            name_song: name_song || song.name_song,
            url_song: resultSong.secure_url || song.url_song,
            cloudinary_id_song: resultSong.public_id || song.cloudinary_id_song,
            category: category || song.category,
            name_singer: name_singer || song.name_singer,
          };

          await Song.findByIdAndUpdate(req.params.id, data, { new: true });
        } else {
          //change song and img
          await cloudinary.uploader.destroy(song.cloudinary_id_song, {
            resource_type: "video",
          });
          const resultSong = await cloudinary.uploader.upload(
            req.files.song[0].path,
            {
              resource_type: "video",
              folder: "AudioUploads",
            }
          );

          await cloudinary.uploader.destroy(song.cloudinary_id_img);
          const resultImg = await cloudinary.uploader.upload(
            req.files.img_song[0].path,
            {
              folder: "SongImg",
            }
          );

          const data = {
            name_song: name_song || song.name_song,
            url_song: resultSong.secure_url || song.url_song,
            cloudinary_id_song: resultSong.public_id || song.cloudinary_id_song,
            img_song: resultImg.secure_url || song.img_song,
            cloudinary_id_img: resultImg.public_id || song.cloudinary_id_img,
            category: category || song.category,
            name_singer: name_singer || song.name_singer,
          };

          await Song.findByIdAndUpdate(req.params.id, data, { new: true });
        }
      }

      res.json({
        success: true,
        message: "Cập nhật bài hát thành công",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
    }
  }
);

//@route DELETE api/songs/upload/:id
//@desc Create song
//@access Private
router.delete("/upload/:id", verifyToken, async (req, res) => {
  try {
    const song = await Song.find({
      id_user: req.userId,
      _id: req.params.id,
    });

    if (!song) {
      res
        .status(400)
        .json({ success: false, message: "Không tìm thấy bài hát" });
    }

    await cloudinary.uploader.destroy(song[0].cloudinary_id_img);
    await cloudinary.uploader.destroy(song[0].cloudinary_id_song, {
      resource_type: "video",
    });

    await Song.findOneAndDelete({
      id_user: req.userId,
      _id: req.params.id,
    });

    res.json({ success: true, message: "Xóa bài hát thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});

//@route GET api/songs/myupload
//@desc Create song
//@access Private
router.get("/myupload", verifyToken, async (req, res) => {
  try {
    const songs = await Song.find({ id_user: req.userId });
    res.json({ success: true, songs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Có lỗi ở phía server" });
  }
});
module.exports = router;
