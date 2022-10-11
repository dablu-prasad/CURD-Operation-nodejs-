
import  jwt from 'jsonwebtoken';
import { userModel } from '../models/userModels.js';

export const auth= async(req,res,next)=>{

  const { token } = req.cookies
 if(token)
 {
  try{

   const {id}=jwt.verify(token,process.env.JWT_SECRET);
   req.logindata=await userModel.findById({ _id: id }).select("-password")
   next()
  }catch (error) {
    console.log(error)
    res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
  }
 }
 if (!token) {
  res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
}
}


