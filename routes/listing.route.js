import express from "express";
import { createListing } from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import multer from "multer";

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const filedata = file.originalname.split(".");
    const ext = filedata[1];
    const name = filedata[0];

    cb(null, name + "_" + new Date().getTime() + "." + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

router.post("/create", upload.array("images", 3), verifyToken, createListing);
// router.delete("/delete/:id", verifyToken, deleteListing);
// router.post("/update/:id", verifyToken, updateListing);
// router.get("/get/:id", getListing);
// router.get("/get", getListings);

export default router;
