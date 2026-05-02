import {mongoose, Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema({
   avatar:{
      type:{
         url:String,
         localPath:String
      },
      default:{
         url:`https://placehold.co/200x200`,
         localPath:""
      }
   },
   username:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      index:true
   },
   email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true
   },
   fullName:{
      type:String,
      trim:true
   },
   password:{
      type:String,
      required:[true,"Password is required"]
   },
   isEmailVerified:{
      type:Boolean,
      default:false
   },
   refreshToken:{
      type:String,
   },
   forgotPasswordToken:{
      type:String
   },
   forgotPasswordExpiry:{
      type:Date
   },
   emailVerificationToken:{
      type:String
   },
   emailVerificationExpiray:{
      type:Date
   }
},{
   timestamps:true
},)


// Prehooks:: data save kerne se pahle data per ki gai operations

userSchema.pre("save", async function(next){
   // /safe gard mecchanisum to avoid again and agian hashing
   if(!this.isModified("password")) return next()
  this.password =  await bcrypt.hash(this.password,10)
   next()
})


// Methos to check give password is same as saved password


userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password,this.password)
}

// PostHooks:: Data save kerne ke baad data per ki gai operations


// Generating Access tokek and referesh token


userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
      {
         // Payload
         _id:this._id,
         email:this.email,
         username:this.username
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
   )
}


userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
      {
         _id:this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
   )
}




// temporary token use for verify the user and password reset 
// this is created without data 
// abce one is created with data


userSchema.methods.generateTemporaryToken = async function(){
   // randomBytes generate how may bytes you want
   const unHashedToken =crypto.randomBytes(20).toString("hex")

   const hashToken=crypto.createHash("sha256").update(unHashedToken).digest("hex")

   const tokenExpiry = Date.now() + (20*60*1000)   // for 20 min

   return {unHashedToken,hashToken,tokenExpiry}
}
// Notes User jaba mongodb me jayega toh User automatically users go jata hai====> lowercase and aaddd s 
export const User = mongoose.model("User",userSchema)
