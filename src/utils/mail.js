import Mailgen from "mailgen";

import nodemailer from "nodemailer"

const sendEmail = async (options)=>{
  const mailGenerator =  new Mailgen({
      theme:"default",
      product:{
         name:"Task managenr",
         link:"https://taskmanagerlink.com"
      }
   })
   const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)

   const emailHtml = mailGenerator.generateHtml(options.mailgenContent)


  const transporter =  nodemailer.createTransport({
      host:process.env.MAILTRAP_SMTP_HOST,
      port:process.env.MAILTRAP_SMTP_PORT,
      auth:{
         user:process.env.MAILTRAP_SMTP_USER,
         pass:process.env.MAILTRAP_SMTP_PASS

      }
      
   })



   const mail = {
      from:"mail.taskmanager@example.com",
      to:options.email,
      subject:options.subject,
      text:emailTextual,
      html:emailHtml
   }


   try {
      await transporter.sendMail(mail)
   } catch (error) {
      console.error("Email Service failed slightly due to credential. check dotenv file")
      console.error("Error: ",error)
   }
}


const emailVerificationMailgenContent = (username,verificationUrl)=>{
   return {
      body:{
         name:username,
         intro:"Welcome to our App! we are excited to have you on board.",
         action:{
            instruction:"To verify your email please click on the following Button",
            button:{
               color:"#22BC66",
               text:"Verify you email",
               link:verificationUrl
            }
         },
         outro:"Need help, or have Questionss ? Just reply to this email we'd love to help you."
      }
   }

}


const forgotPasswordMailgenContent = (username,passwordResetUrl)=>{
   return {
      body:{
         name:username,
         intro:"We got the request to reset the password of the your account.",
         action:{
            instruction:"To reset the password click on the following button or link. ",
            button:{
               color:"#87bc9e",
               text:"Reset password",
               link:passwordResetUrl
            }
         },
         outro:"Need help, or have Questionss ? Just reply to this email we'd love to help you."
      }
   }

}


export {
   emailVerificationMailgenContent
   ,forgotPasswordMailgenContent
   ,sendEmail
}