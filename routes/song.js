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
// router.post("/", verifyToken, async (req, res) => {
//   const { title, description, url, status } = req.body;

//   //Simple validation
//   if (!title)
//     return res
//       .status(400)
//       .json({ success: false, message: "Title is requied" });

//   try {
//     const newPost = new Post({
//       title,
//       description,
//       url: url.startsWith("https://") ? url : `https://${url}`,
//       status: status || "TO LEARN",
//       user: req.userId,
//     });

//     await newPost.save();

//     res.json({ success: true, message: "Happy learning!", post: newPost });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal server errorr" });
//   }
// });

// //@route PUT api/songs/:id
// //@desc Edit post
// //@access Private
// router.put("/:id", verifyToken, async (req, res) => {
//   const { title, description, url, status } = req.body;

//   //Simple validation
//   if (!title)
//     return res
//       .status(400)
//       .json({ success: false, message: "Title is requied" });

//   try {
//     let updatedPost = {
//       title,
//       description: description || "",
//       url: (url.startsWith("https://") ? url : `https://${url}`) || "",
//       status: status || "TO LEARN",
//     };

//     const postUpdateCondition = { _id: req.params.id, user: req.userId };

//     updatedPost = await Post.findOneAndUpdate(
//       postUpdateCondition,
//       updatedPost,
//       { new: true }
//     );

//     //User not authorised to update post
//     if (!updatedPost)
//       return res.status(401).json({
//         success: false,
//         message: "Post not found or user not authorised",
//       });

//     res.json({
//       success: true,
//       message: "Exellent progress!",
//       post: updatedPost,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal server errorr" });
//   }
// });

// //@route DELETE api/songs/:id
// //@desc Delete post
// //@access Private
// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     const postDeleteCondition = { _id: req.params.id, user: req.userId };
//     const deletePost = await Post.findOneAndDelete(postDeleteCondition);

//     //User not authorised or post not found
//     if (!deletePost)
//       return res.status(401).json({
//         success: false,
//         message: "Post not found or user not authorised",
//       });

//     res.json({ success: true, post: deletePost });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal server errorr" });
//   }
// });

module.exports = router;
