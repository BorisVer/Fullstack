require("dotenv").config();
const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");

const app = express();

logger.info("connecting to MongoDB");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;
