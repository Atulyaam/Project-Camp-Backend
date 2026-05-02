import { ApiResponse } from "../utils/api-reponse.js";


import { asyncHandler } from "../utils/async-handller.js";



// Way one to write
// const healthCheck = async(req,res,next)=>{
//    try {
//       const user = await getUserFromDB();
//       res.status(200).json(
//          new ApiResponse(200,{Message:"Server is Running. "})
//       )
//    } catch (error) {
//       next(error)
      
//    }
// }


// Way 2 me hum ek bar likhte hai baar bar import ker sakte hai issse try catch baar bar likne ki jarurat nahi padegiii

const healthCheck = asyncHandler(
   async (req,res)=>{
      res
      .status(200)
      .json(
         new ApiResponse(200,{Message:"Server is Still Running. well bro"})
      )
   }
)

export {healthCheck}