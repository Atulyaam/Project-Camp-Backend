import express from "express"
import cors from "cors"


const app = express()

// express configuration
// app.use acct as middleware jab middle ware hota hai tba use hota hai

// express configuration

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
// staic help kertha hai file sko use krn eme jaise ab hum image folder ko ue kersakte hai express me 
app.use(express.static("public"))

// cors configuration
app.use(cors({
   origin:process.env.CORS_ORIGIN?.split(",")|| "http://localhost:5173",
   credentials:true,
   methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
   allowedHeaders:["Authorization","Content-Type"]
})); 

// emport the routes

import healthCheckRouter from "./routes/healthcheck.routes.js"



app.use("/api/v1/healthcheck",healthCheckRouter)


app.get("/", (req, res) => {
  res.send("Hello World!!!!!!!!!!!!!!now!!!!!!!!!!")
})

export default app;