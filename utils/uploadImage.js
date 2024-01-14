import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import multer from "multer";
import path from 'path';
import * as dotenv from "dotenv";
dotenv.config();


const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY, // store it in .env file to keep it safe
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_REGION, // this is the region that you select in AWS account
});

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: "fileuploadimages", // change it as per your project requirement
  acl: "public-read", // storage access type
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const filedata = file.originalname.split(".");
    const ext = filedata[1];
    const name = filedata[0];
    const fileName = name + "_" + new Date().getTime() + "." + ext;
    const { id: userId } = req.user;
    cb(null, `${userId}/${fileName}`);
  },
});


const sanitizeFile = (file, cb) => {
  // Define the allowed extension
  const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

  // Check allowed extensions
  const isAllowedExt = fileExts.includes(
    path.extname(file.originalname.toLowerCase())
  );

  // Mime type must be an image
  const isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true); // no errors
  } else {
    // pass error msg to callback, which can be displaye in frontend
    cb("Error: File type not allowed!", false);
  }
}


// our middleware
export const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback)
    }
})

