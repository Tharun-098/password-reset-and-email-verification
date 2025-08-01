import { assets } from "../assets/assets"
import {toast} from 'react-toastify'
import { useRef, useState } from "react";
import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router";
const ResetPassword = () => {
  const {axios}=useContext(DataContext);
  const [email,setEmail]=useState("")
  const [otp,setOtp]=useState(0)
  const [newPassword,setNewPassword]=useState("")
  const [emailSent,setEmailSent]=useState(false)
  const [otpSent,setOtpSent]=useState(false)
  const navigate=useNavigate();
  const inputRef = useRef([]);
    console.log(inputRef);
    const handleInput = (e, index) => {
      const value = e.target.value;
      if (value && index < inputRef.current.length - 1) {
        inputRef.current[index + 1].focus();
      }
    };
    const handleKeyDown = (e, index) => {
      const value = e.target.value;
      if (e.key === "Backspace" && value === "" && index > 0) {
        inputRef.current[index - 1].focus(); // Move back
      }
    };
    const handlePaste = (e) => {
      const paste = e.clipboardData.getData("text");
      const pasteArray = paste.split("");
      pasteArray.forEach((char, index) => {
        if (inputRef.current[index]) {
          inputRef.current[index].value = char;
        }
      });
    };
    const handleSubmit=async(e)=>{
      e.preventDefault();
      try {
        const {data}=await axios.post('/api/auth/password/reset-otp',{email});
        if(data.success){
          toast.success(data.message);
          setEmailSent(true);
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    const handleOtpChange=(e)=>{
      e.preventDefault();
      const otpArray=inputRef.current.map(e=>e.value);
      setOtp(otpArray.join(""));
      setOtpSent(true);
    }
    const handlePassword=async(e)=>{
      e.preventDefault();
      try {
        const {data}=await axios.post('/api/auth/password/change',{email,otp,newPassword});
        if(data.success){
          toast.success(data.message);
          navigate('/login');
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  return (
    <div className="flex  items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500">
        <img src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer mb-8"/>
        {!emailSent && (
          <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-90 text-md text-shadow-indigo-800">
          <h1 className="text-center text-xl">Password Reset</h1>
          <p className='text-sm text-center'>Enter your registered gmail address</p>
          <form onSubmit={handleSubmit}>
            <div className="mt-2 relative">
            <img src={assets.mail_icon} className="absolute w-5 top-3.5 left-2"/>
            <input type="email" placeholder="Enter the mailid" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-lg bg-gray-200 text-black p-2 pl-10 focus:ring-2 focus:ring-blue-500 outline-0"/>
            </div>
            <div className="w-full text-center">
              <button className="p-2 hover:bg-blue-600 w-20 text-sm bg-blue-300 transition-all rounded-lg text-center mt-2">submit</button>
            </div>
          </form>
        </div>
        )}
        {!otpSent && emailSent && (
          <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-90 text-md text-shadow-indigo-800">
        <h1 className="text-center text-xl">OTP Verification</h1>
        <p className="text-sm">
          Enter your six digit otp for password reset
        </p>
        <div
          className="flex justify-between  mt-2 mb-4 gap-2"
          onPaste={handlePaste}
          >
          {Array(6)
            .fill()
            .map((_, index) => (
              <input
              type="text"
              key={index}
              maxLength={1}
              className="w-10 h-10 bg-gray-300 rounded-lg p-2 text-center"
              required
              ref={(e) => (inputRef.current[index] = e)}
              onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button onClick={handleOtpChange} className="w-full p-2 text-sm sm:text-md bg-gradient-to-br from-blue-600 to-violet-400 rounded-lg">
          verify otp
        </button>
      </div>
      )}
      {emailSent && otpSent && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-90 text-md text-shadow-indigo-800">
          <h1 className="text-center text-xl">Change Password</h1>
          <p className='text-sm text-center'>Enter new Password</p>
          <form onSubmit={handlePassword}>
            <div className="mt-2 relative">
            <img src={assets.lock_icon} className="absolute w-5 top-1.5 left-2"/>
            <input type="String" placeholder="Enter the new password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full rounded-lg bg-gray-200 text-black p-2 pl-10 focus:ring-2 focus:ring-blue-500 outline-0"/>
            </div>
            <div className="w-full text-center">
              <button className="p-2 hover:bg-blue-600 w-20 text-sm bg-blue-300 transition-all rounded-lg text-center mt-2">change</button>
            </div>
          </form>
        </div>
  )}
    </div>
  )
}

export default ResetPassword
