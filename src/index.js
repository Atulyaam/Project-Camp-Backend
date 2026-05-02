
import dotenv from "dotenv";
import app from "./app.js"
import connectDB from "./DB/index.js";


dotenv.config();


const PORT = process.env.PORT || 3000





connectDB()
   .then(
      ()=>{
         app.listen(PORT, () => {
         console.log(`Server running at http://localhost:${PORT}`)
})

      }

   )
   .catch((error)=>{
      console.error("❌ Mongodb Error: ",error)
   })


// com monjs used for required and module used for module sytext in type




