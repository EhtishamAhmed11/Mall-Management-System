import User from "../models/user.js";
import jwt from "jsonwebtoken"
import CustomAPIError from "../errors/index.js";


const auth = async(req,res,next)=>{
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new CustomAPIError.UnauthorizedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token,process.env.JWT_SEC)
    req.user = {user_id:payload.user_id,username:payload.username}
    next()
  } catch (error) {
    throw new CustomAPIError.UnauthorizedError('Authentication invalid')
    
  }
}

export  {auth}