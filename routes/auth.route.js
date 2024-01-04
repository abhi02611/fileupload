import express from 'express';
import { signUp, signIn, signOut } from "../controller/auth.controller.js";

const route = express.Router();


route.post("/signup", signUp);
route.post("/signin", signIn);
route.post("/signout", signOut);


export default route;