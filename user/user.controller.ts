import express, { Request, Response } from 'express';
import { UserService } from './user.service';
const app=express();
const userservice=new UserService();
export class UserController{
    public async CreateUser(req:any,res:any){
        try{
            const response=await userservice.createUser(req,res);
            return res.status(200).send({result:"User created successfully"});
        }
        catch (err: any) {
            const errorCode = err.statusCode || 400;
            return res.status(errorCode).json({
              message: err.message,
              extensions: {
                code: err.code,
                stackTrace: err.stack,
              },
            });
    }
}
  public async VerifyCode(req:any,res:any){
  try{
        await userservice.verifyCode(req,res);
        return res.status(200).send({result:"User Verified Successfully"});
    }
    catch (err: any) {
      const errorCode = err.statusCode || 400;
      return res.status(errorCode).json({
      message: err.message,
      extensions: {
      code: err.code,
      stackTrace: err.stack,
      },
    });
  }
}
public async ResendCode(req:any,res:any){
  try{
    await userservice.ResendCode(req,res);
    return res.status(200).send({result:"Resend Code send Successfully"})
  }
  catch (err: any) {
    const errorCode = err.statusCode || 400;
    return res.status(errorCode).json({
    message: err.message,
    extensions: {
    code: err.code,
    stackTrace: err.stack,
    },
  });
}
}
public async SignIn(req:any,res:any){
  try{
      const response=await userservice.SignIn(req,res);
      return res.status(200).send({accessToken:response?.AuthenticationResult?.AccessToken,idToken:response?.AuthenticationResult?.IdToken});
  }
  catch (err: any) {
      const errorCode = err.statusCode || 400;
      return res.status(errorCode).json({
        message: err.message,
        extensions: {
          code: err.code,
          stackTrace: err.stack,
        },
      });
}
}
public async ForgotPassword(req:any,res:any){
  try{
      const response=await userservice.ForgotPassword(req,res);
      return res.status(200).send({result:"Mail send successfully"});
  }
  catch (err: any) {
      const errorCode = err.statusCode || 400;
      return res.status(errorCode).json({
        message: err.message,
        extensions: {
          code: err.code,
          stackTrace: err.stack,
        },
      });
}
}
public async PasswordVerify(req:any,res:any){
  try{
      const response=await userservice.PasswordVerify(req,res);
      return res.status(200).send({result:"Password verified successfully"});
  }
  catch (err: any) {
      const errorCode = err.statusCode || 400;
      return res.status(errorCode).json({
        message: err.message,
        extensions: {
          code: err.code,
          stackTrace: err.stack,
        },
      });
}
}
}