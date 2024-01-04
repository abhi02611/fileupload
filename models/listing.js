import mongoose from "mongoose";

const listingSchema = mongoose.Schema({
  comment: String,
  listingId: String,
  imageUrls: [String],
  userId: String,
});

const Listing = mongoose.model("Listng", listingSchema);

export default Listing;