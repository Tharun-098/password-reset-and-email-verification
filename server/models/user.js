import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
  username:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  isAccountVerify:{type:Boolean,default:false},
  resetOtp:{type:String,default:''},
  resetOtpExpires:{type:Number,default:0},
  verifyOtp:{type:String,default:''},
  verifyOtpExpires:{type:Number,default:0},
},{timestamps:true}
);

const User=mongoose.models.user || mongoose.model('user',userSchema);

export default User;