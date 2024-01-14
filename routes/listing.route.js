import express from "express";
import { createListing } from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { uploadImage } from "../utils/uploadImage.js";
 
const router = express.Router();
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     const filedata = file.originalname.split(".");
//     const ext = filedata[1];
//     const name = filedata[0];

//     cb(null, name + "_" + new Date().getTime() + "." + ext);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
router.post(
  "/create",
  verifyToken,
  uploadImage.array("images", 3),
  createListing
);
// router.delete("/delete/:id", verifyToken, deleteListing);
// router.post("/update/:id", verifyToken, updateListing);
// router.get("/get/:id", getListing);
// router.get("/get", getListings);

export default router;
