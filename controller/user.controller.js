import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import Listing from "../models/listing.js";

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json({ success: true, data: rest });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userId: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};


export const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  if (req.user && req.isAdmin === false)
    return next(errorHandler(401, "Only admin can update the user"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(password, 10);
    }

    // const originalUser = await User.findById(userId).exec();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          status: req.body.status,
          isActive: req.body.status === "APPROVED" ? true : false
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({ success: true, data: rest });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  if (req.user && req.isAdmin === false)
    return next(errorHandler(401, "You are not authorized"));
  try {
    await User.findByIdAndDelete(userId);
    res.clearCookie("access_token");
    res.status(200).json("user has been deleted successfully");
  } catch (err) {
    next(err);
  }
};



