import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mail.js";

export const signUp = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json("email field is required");
  }
  if (!password) {
    res.status(400).json("password field is required");
  }

  const existingUser = await User.findOne({ email });

  if(existingUser) {
    res.status(400).json("user already exists with the given email");
  }

  const haspassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    email,
    password: haspassword,
    isActive: false,
    isAdmin: false,
    status: "PENDING"
  });

  try {
    const savedDoc = await newUser.save();
    //sending a email notification to admin
    sendMail(
      "System Generated",
      "codasphere@gmail.com",
      "abhibajaj622@gmail.com",
      email
    );
    
    const newSavedUser = {
      id: savedDoc.id,
      email: savedDoc.email,
      status: savedDoc.status,
      isActive: savedDoc.isActive,
      isAdmin: savedDoc.isAdmin
    };

    res.status(201).json({ success: true, data: newSavedUser });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validateUser = await User.findOne({ email });
    if (!validateUser) {
      res.status(201).json("User is created successfully");
    }

    const validPassword = bcryptjs.compareSync(password, validateUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid Password"));
    }

   const { password: pass, ...userInfo } = validateUser._doc;

    if(validateUser.isAdmin){
      const userList = await User.find({status: "PENDING", isActive: false})
                      .select('-password -status');          
      
      userInfo.pendingUser = userList;               
    }

    const token = jwt.sign(
      {
        id: validateUser.id,
        email: validateUser.email,
        isAdmin: validateUser.isAdmin,
        isActive: validateUser.isActive
      },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({success: true, data: userInfo});
  } catch (error) {
    next(err);
  }
};

export const signOut = (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out successfully");
  } catch (error) {
    next(error);
  }
};