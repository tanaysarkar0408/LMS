import { clerkClient } from "@clerk/express";   

//Middleware (Protect Educator routes)
export const protectEducator = async (req,res,next) => {
    try {
        const userId = req.auth.userId;
        const response = await clerkClient.users.getUser(userId)
        const role = response.publicMetadata.role;
        if(role !== "educator"){
            return res.json({
                success : false,
                message : "Unauthorized Access"
            })
        }
        next()
    } catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
}
