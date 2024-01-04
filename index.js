import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRoute from "./routes/listing.route.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from 'morgan';
import fs from "fs";

const app = express();
dotenv.config();

// directory path
const __dirname = path.resolve();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
//render static files
console.log(__dirname);
console.log(path.join(__dirname, "/public/images"))
app.use("/static", express.static(path.join(__dirname, "public", "images")));
const PORT = process.env.PORT || 3000;

console.log(process.env.MONGO_DB_URI);

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to database successfully!!");
      console.log(`listening on port ${PORT}!!`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to database");
  });

// api routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRoute);

// error middleware
app.use((err, req, res, next) => {
  console.log("err", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
