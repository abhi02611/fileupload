import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

   let token = null;
   const authorization = req.headers.authorization;
   if(authorization) {
      const authData = authorization.split(" ");
      if(authData[0] === "Bearer" && authData[1]) {
         token = authData[1];
      }
   }
  if(!token) {
     return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
     if(err) return next(errorHandler(403, "Forbidden, Token not verified"));
     console.log(user);
     req.user = user;
     next();
  })

}