import express from "express";
import {
  createListing,
  deleteListing,
  getlistById,
} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { uploadImage } from "../utils/uploadImage.js";
 
const router = express.Router();

router.post(
  "/create",
  verifyToken,
  uploadImage.array("images", 3),
  createListing
);
router.delete("/delete/:id", verifyToken, deleteListing);
// router.post("/update/:id", verifyToken, updateListing);
router.get("/:id", verifyToken, getlistById);
// router.get("/get", getListings);

export default router;
