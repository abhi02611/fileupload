import Listing from "../models/listing.js";
import User from "../models/user.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  if (req.user.id !== req.body.userId) {
    res.status(400).json("You are not logedIn user");
  }
  const { comment, listingId, userId } = req.body;
  let imageUrls = [];
  const userData = await User.findById(userId);

  if (!userData) {
    res.status(400).json("user is not present");
  }

  const images = req.files;
  if (images && images.length > 0) {
    imageUrls = images.map((image) => {
      return image.location;
    });
  }

  const newlisting = new Listing({
    comment,
    listingId,
    userId,
    imageUrls,
  });

  try {
    const savedListing = await newlisting.save();
    console.log(savedListing);
    const newListing = {
      id: savedListing.id,
      comment: savedListing.comment,
      imageUrls: savedListing.imageUrls,
      listingId: savedListing.listingId,
      userId: savedListing.userId,
    };
    res.status(200).json({ success: true, data: newListing });
  } catch (err) {
    next(err);
  }
};

export const getlistById = (req, res, next) => {
  const id = req.params.id;
  try {
    const listing = Listing.findById(id);
    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  if (!req.user.isAdmin) {
    next(errorHandler(401, "Only admin can delete the listing!"));
  }
  const listingId = req.params.id;
  console.log(req.param);
  try {
    await Listing.findByIdAndDelete(listingId);
    res
      .status(200)
      .json({
        success: true,
        message: `Listing with Id ${listingId} is deleted successfully.`,
      });
  } catch (err) {
    next(err);
  }
};
