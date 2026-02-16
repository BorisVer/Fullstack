require("dotenv").config();
const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const { tokenExtractor } = require("./utils/middleware");

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
app.use(tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

const errorHandler = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  }
  next(error);
};

app.use(errorHandler);

module.exports = app;
