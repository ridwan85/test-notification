import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import swaggerUi from "swagger-ui-express";
import mongoose from "mongoose";
import { config } from "dotenv";
const swaggerDocument = require("../swagger.json");

config();

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
require("./models/notifications");
const router = require("./routes/notifications");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/notifications", router);

module.exports = app;
