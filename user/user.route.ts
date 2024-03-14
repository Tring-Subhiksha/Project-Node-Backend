import { Router } from "express";
import { UserController } from "./user.controller";
const userrouter=Router();
console.log("Userrouter");

const usercontroller=new UserController();
userrouter.post("/register",usercontroller.CreateUser);
userrouter.post("/verifyCode",usercontroller.VerifyCode);
userrouter.post("/resendcode",usercontroller.ResendCode);
userrouter.post("/signin",usercontroller.SignIn);
userrouter.post("/forgotpassword",usercontroller.ForgotPassword);
userrouter.post("/passwordverify",usercontroller.PasswordVerify);
export default userrouter;
