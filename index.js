require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRouter = require("./Routes/auth");
const songRouter = require("./Routes/song");
const favoriteSongRouter = require("./Routes/favoriteSong");

const connecDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@zingmp3.kaw2q.mongodb.net/zingmp3?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connecDB();

const app = express();
app.use(express.json());

app.use(cors());

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);
app.use("/api/favorite-song", favoriteSongRouter);

const PORT = 3001;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
