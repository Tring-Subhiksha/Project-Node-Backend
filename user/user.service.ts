import express, { Request, Response } from 'express';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    AdminDeleteUserCommand,
    ResendConfirmationCodeCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
    AdminAddUserToGroupCommand,
    
} from '@aws-sdk/client-cognito-identity-provider';
import { QueryHasura } from '../helper/query-hasura';
import { GetUsersByEmail, InsertUser,verifyCode,UpdatePassword } from '../utils/gql-queries';
dotenv.config();

const AWS_COGNITO_REGION = 'ap-south-1'
const AWS_COGNITO_CLIENTID = '5jh76pluajtvfpb7qb70pdfvrj'
const AWS_COGNITO_USERPOOL_ID = 'ap-south-1_TjXoQHv38';
export class UserService{
    static cognitoClient: CognitoIdentityProviderClient = new CognitoIdentityProviderClient({
        region: AWS_COGNITO_REGION,
    });
    public async createUser(req:any,res:any){
    try{
    const email = req.body.input.input.email;
    const password = req.body.input.input.password;
    const username=req.body.input.input.username;
    const userpresent=await QueryHasura(GetUsersByEmail,{email:email})
    console.log("user",userpresent)
    if(userpresent.users.length===0){
    const params = {
        ClientId: AWS_COGNITO_CLIENTID,
        Username: req.body.input.input.email,
        Password: password,
        UserAttributes: [
            { Name: 'email', Value: email },
        ],
    };
    const signUpCommand = new SignUpCommand(params);
    const signUpResponse:any = await UserService.cognitoClient.send(signUpCommand);
    // const response =await UserService.addUserToGroup({emailId: email, group :'user'});
    const data: any = {
        Username: email,
        GroupName: 'user',
        UserPoolId: AWS_COGNITO_USERPOOL_ID,
      };
      console.log('Cognito SignUp response:', signUpResponse);

      try {
        const response = await UserService.cognitoClient.send(new AdminAddUserToGroupCommand(data));
        console.log("addUserToGroup response",response);
        
      } catch (error: any) {
        console.log('add user to group error',error.message);
        
      }

    const result=await QueryHasura(InsertUser,{email:email,
        password:password,
        username:username,
        u_cognito_id:signUpResponse.UserSub});
    //  return res.status(200).send({result,success: "Success" } );
    }
    else{
        throw new Error("Email already exists");
    }
}
catch(err: any) {
    console.log("error",err);
    throw err;
}
}
public async verifyCode(req:any,res:any){
    try{
        const email = req.body.input.input.email;
        const code=req.body.input.input.code;
        const params = {
            ClientId: AWS_COGNITO_CLIENTID,
            ConfirmationCode: code,
            Username: email,
        };
        const ver=await UserService.cognitoClient.send( new ConfirmSignUpCommand(params));
        console.log("ver",ver)
        await QueryHasura(verifyCode,{email:email});
}
catch(err: any) {
    console.log("error",err);
    throw new Error("Invalid code Provided,Please request a code again");
}
}
public async ResendCode(req:any,res:any){
    try{
        const email = req.body.input.input.email;
        const code=req.body.input.input.code;
        const params = {
            ClientId: AWS_COGNITO_CLIENTID,
            // ConfirmationCode: code,
            Username: email,
        };
        const ver=await UserService.cognitoClient.send( new ResendConfirmationCodeCommand(params));
        console.log("ver",ver)
        // await QueryHasura(ResendCode,{email:email});
}
catch(err: any) {
    console.log("error",err);
    throw new Error("Invalid code Provided,Please resend a code again");
}
}
public async SignIn(req:any,res:any){
    try{
    const email = req.body.input.input.email;
    const password = req.body.input.input.password;
    const params:any = {        
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: AWS_COGNITO_CLIENTID,
        AuthParameters:{
            USERNAME:email,
            PASSWORD:password,
        }
    };
    const signInResponse:any = await UserService.cognitoClient.send(new InitiateAuthCommand(params));
    console.log('Cognito SignIn response:', signInResponse);
    return signInResponse;
}
catch(err: any) {
    console.log("error",err);
    throw err;
}
}
public async ForgotPassword(req:any,res:any){
    try{
    const email = req.body.input.input.email;
    const userpresent=await QueryHasura(GetUsersByEmail,{email:email})
    console.log("user",userpresent)
    if(!userpresent.users[0]){
        throw new Error("Email not found");

    }
    else{
        const params = {
            ClientId: AWS_COGNITO_CLIENTID,
            Username: req.body.input.input.email,
            UserAttributes: [
                { Name: 'email', Value: email },
            ]
        };
        const ForgotCommand = new ForgotPasswordCommand(params);
        const ForgotPasswordResponse:any = await UserService.cognitoClient.send(ForgotCommand);
        console.log('Cognito SignUp response:', ForgotPasswordResponse);
    }
}
catch(err: any) {
    console.log("error",err);
    throw err;
}
}
public async PasswordVerify(req:any,res:any){
    try{
        const email = req.body.input.input.email;
        const Newpassword = req.body.input.input.password;
        const code=req.body.input.input.code;
        const userpresent=await QueryHasura(GetUsersByEmail,{email:email})
        console.log("user",userpresent)
        if(userpresent.users.length!==0){
            const params = {
                ClientId: AWS_COGNITO_CLIENTID,
                Username: email,
                Password: Newpassword,
                ConfirmationCode: code,
                UserAttributes: [
                    { Name: 'email', Value: email },
                ]
            };
            const PasswordVerify = new ConfirmForgotPasswordCommand(params);
            const PasswordVerifyResponse:any = await UserService.cognitoClient.send(PasswordVerify);
            console.log('Cognito SignUp response:', PasswordVerifyResponse);
            const result=await QueryHasura(UpdatePassword,{email:email,
                newPassword:Newpassword
            });
        }
        else{
            throw new Error("Email not found");
        }
    }
    catch(err: any) {
        console.log("error",err);
        throw err;
    }
}
}