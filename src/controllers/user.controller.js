import { asyncHandler } from "../utils/asyncHandler.js";
import {client} from "../DB/index.js"
import jwt from "jsonwebtoken";
import axios from 'axios';

export const getStarted = asyncHandler(async (req, res) => {
    const {token } = req.body;

    if (!token) {
        res.status(400).json({statusCode : 400,message : 'Token is required for Google login'});
        return ;
    }

    let email, srmId, avatar, userName ;

    try {
        // Fetch user information from Google OAuth API
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (!data || !data.email) {
            res.status(500).json({ statusCode : 500, message : 'Failed to retrieve user data from Google'});
            return ;
        }

        if(!data.email.endsWith("@srmap.edu.in")){res.status(400).json({statusCode : 400 , message : "Please use your SRM email to login"}); return}    

        email = data.email;
        srmId = data.name.split(' | ')[1];
        avatar = data.picture;
        userName = data.name.split(' | ')[0].toLowerCase();
        

        // Check if user already exists in the database
        let user = await client.user.findFirst({
            where: { email: email },
        });

        if (!user) {
            // Create a new user if not found
            user = await client.user.create({
                data: {
                    userName,
                    email: email,
                    srmId,
                    avatar
                },
            });
        }

        const jwtToken = jwt.sign({
            id : user.id ,
            userName : user.userName ,
            srmId    : user.srmId ,
            role  : user.role ?? "unverified" ,
            gender : user.gender ?? "unverified" ,
            avatar : user.avatar
        } , process.env.TOKEN)

        res.status(200).json({
            message: 'Login successful',
            user ,
            Token : jwtToken
        });
    } catch (error) {
        console.error('Error during Google OAuth:', error.message || error.response?.data || error);
        res.status(500).json({statuscode : 500 , message : 'Failed to authenticate with Google'});
        return
    }
});

export const completeProfile = asyncHandler( async (req ,res) => {
    const {Role , gender} = req.body;
    const id = req.user.id

    const response = await client.user.update({
        where : {
            id ,
        },
        data : {
            gender , Role
        }
    })

    if(!response) {res.status(404).json({statusCode : 404 , message :"user not found"}); return}

    res.status(200).json({message : "user details updated"})
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await client.user.findFirst({
        where: { id: req.user.id },
        select: {
            id: true,
            userName: true,
            email: true,
            srmId: true,
            role: true,
        }});
    if (!user) {
        res.status(404).json({statusCode : 404 , message : "User not found"});
        return;
    }

    const jwtToken = jwt.sign({
        id : user.id ,
        userName : user.userName ,
        srmId    : user.srmId ,
        role  : user.role ?? "unverified" ,
        gender : user.gender ?? "unverified" ,
        avatar : user.avatar,
        email : user.email
    } , process.env.TOKEN);

    res.status(200).json({user , Token : jwtToken});
});