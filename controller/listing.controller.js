import Listing from '../models/listing.js';
import User from "../models/user.js";

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
      return "/static/" +image.path.split("/")[2];
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
    res.status(200).json({success: true, data: newListing});
  } catch (err) {
    next(err);
  }
};

export const getlistById = (req, res, next) => {
      const id = req.params.listingId;
     try {
      const listing =  Listing.findById(id);
      res.status(200).json({success: true, data: listing}); 
     } catch(err) {
        next(err);
     }
    
}

