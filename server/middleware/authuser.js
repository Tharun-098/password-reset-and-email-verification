import jsonwebtoken from 'jsonwebtoken';
const authenticateUser=(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized User"});
        }
        const decode=jsonwebtoken.verify(token,process.env.JWT_REFRESH_TOKEN);
        if(decode.id){
              //req.body.userId=decode.id;
              req.userId=decode.id;
        }else{
            return res.status(401).json({success:false,message:"Unauthorized User"});
        }
        next();
    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

export default authenticateUser;