import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  status: {
   type: String,
   enum: ["PENDING", "APPROVED"],
   default: "PENDING" 
  },
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

export default User;