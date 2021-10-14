//Library
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Models
import {UserModel} from "../../database/user";

const Router = express.Router();

/*
Route :     /signup
des.  :     Signup with email and password
Params:     none
Access:     public
method:     POST
*/
Router.post("/signup" , async(req,res) => {
    try {
        
        await UserModel.findByEmailAndPhone(req.body.credentials);
    
       
       // save to database
      const newUser =  await UserModel.create (req.body.credentials); //updating existing password with hashed password

       //generate JWT auth token
      const token = newUser.generateJwtToken();  //secretkey

       //return
       
    return res.status(200).json({token , status:"Success"});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
 });

 /*
Route :     /signup
des.  :     Signup with email and password
Params:     none
Access:     public
method:     POST
*/

Router.post("/signin" , async(req,res) => {
    try {
        
      const checkUserByEmail =  await UserModel.findByEmailAndPassword(req.body.credentials);

    //generate JWT auth token
      const token = checkUserByEmail.generateJwtToken();  //secretkey
     //return  
    return res.status(200).json({token , status:"Success"});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
 });
export default Router;