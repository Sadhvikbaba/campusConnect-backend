import jwt from "jsonwebtoken";

export const authMiddleware = (req , res , next) => {
    
    const header = req?.headers?.authorization;
    if (!header) {
        res.status(403).json({message: "Unauthorized"})
        return
    }
    const token = header.replace('Bearer ' , '');

    if (!token) {
        res.status(403).json({message: "Unauthorized"})
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN)
        if (!decoded){
            res.status(400).json("message : unauthorized")
        }
        
        req.user = decoded ;
        next()
    } catch(e) {
        res.status(401).json({message: "Unauthorized"})
        return
    }
}