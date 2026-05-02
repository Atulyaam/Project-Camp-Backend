import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-reponse.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handller.js";
import {emailVerificationMailgenContent, sendEmail} from "../utils/mail.js"


const generateAccessAndRefreshToken = async(userId)=>{
   try {
      const user = await User.findById(userId)
      const accessToken  =user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave:false})
      return {accessToken,refreshToken}
   } catch (error) {
      throw new ApiError(
         500,
         "Something went Wrong while genrating Acces tokens"
      )
   }
}


const registerUser = asyncHandler(async(req,res)=>{
   const {email,username,password,role} = req.body

   const existingUser = await User.findOne({
      $or:[{username},{email}]
   })

   if(existingUser){
      throw new ApiError(409,"User already exist",[])
   }
   const user = await User.create({
      email,
      password,
      username,
      isEmailVerified:false
   })

   const {unHashedToken,hashToken,tokenExpiry}=user.generateTemporaryToken()

   user.emailVerificationToken = hashedToken
   user.emailVerificationExpiry = tokenExpiry

   await user.save({validateBeforeSave:false})


   await sendEmail({
      email:user?.email,
      subject:"Please verify Your Email",
      mailgenContent:emailVerificationMailgenContent(
         user?.username,
         `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
      )
   })

   const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

   if(!createdUser){
      throw new ApiError(
         500,
         "Something went Wrong While registering the user"
      )
   }

   return res
     .status(201)
     .json(
       new ApiResponse(
         201,
         {user:createdUser},
         "user Registerd successfully and veriication email send on you email"
       )
     )

})

export { registerUser }
