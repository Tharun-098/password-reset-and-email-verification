import User from "../models/user.js";

const getUserData=async(req,res)=>{
    try{
        const userId=req.userId;
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        return res.json({success:true,userData:{
            username:user.username,
            isAccountVerify:user.isAccountVerify
        }})
    }
    catch(error){
        return res.json({success:false,message:error.message});
    }
}

export default getUserData;