import { User } from "@/models/user.model"
import jwt from 'jsonwebtoken'



export const generateTokens = async(userId)=>{
    try {
        
        const user = await User.findById(userId)
        const accessToken=jwt.sign(
                {
                    _id:user._id,
                    email:user.email
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
                }
            )
        const refreshToken=jwt.sign(
                {
                    _id:user._id,
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
                }
            )
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new Error("Cant generate tokens",error.message)
    }
}