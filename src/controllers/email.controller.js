import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import {sendMail} from "../utils/sendMail.js"
import { client } from "../DB/index.js";


const emailsByResponse = {
    "Issues with mess food or services" : "psadhvik2006@gmail.com",
    "Issues with internet or network" : "kiraneswar999@gmail.com",
    "Issues with electrical maintenance" : "likhithcvsrl@gmail.com",
    "Issues with plumbing or water" : "balueswar109@gmail.com",
    "Issues with transportation" : "sniperafroz@gmail.com",
    "it is a general talk" : null ,
    "Irrelevant or unclear input" : null
}

export const emailFinder = asyncHandler( async (req , res) => {
    const userEmail = req.user.email ;
    const {body} = req.body;

    const response = await axios.post(`${process.env.VERIFYURL}/classify` , {problem : body})

    if(!response.data){ res.status(500).json({statusCode : 500 ,message : "internal server error"});return ;}

    const reason = response.data?.predicted_department;

    if(!emailsByResponse[reason]){res.status(404).json({statusCode : 404 , message : "we can find solution for your problem"});return ;}

    console.log(reason);
    

    if(!reason){res.status(404).json({statusCode : 404 , message : "we can find solution for your problem"});return ;}

    sendMail({to : emailsByResponse[reason] , text : body , cc : userEmail , details : req.user})

    await client.mail.create({
        data: {
          userId: req.user.id, 
          body, 
          to: emailsByResponse[reason], 
        },
      });

    res.status(200).json({message : `mail sent successfully to ${emailsByResponse[reason]}`})
    

});

export const getUserEmails = asyncHandler( async (req , res) => {
    const userid = req.user.id ;

    const response = await client.mail.findMany({
        where : {
            userId : userid
        }
    })
    
    if(!response){ res.status(500).json({statusCode : 500 ,message : "internal server error"});return ;}

    res.status(200).json({emails : response})
});