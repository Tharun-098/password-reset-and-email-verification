import { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { DataContext } from "../context/DataContext";
import {toast} from 'react-toastify';
import {useNavigate } from "react-router";
const EmailVerify = () => {
  const inputRef = useRef([]);
  const otpRef=useRef(false);
  console.log(inputRef);
  const {axios,isLoggedIn,user,getUser}=useContext(DataContext);
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
  const navigate=useNavigate();
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };
   useEffect(()=>{
     const otp=async()=>{
       try {
         const {data}=await axios.post('api/auth/email/send-Otp',{});
         if(data.success){
           toast.success(data.message);
           otpRef.current=true;
         }
         else{
           toast.error(data.message);
         }
       } catch (error) {
         toast.error(error.message);
       }
     }
      if (isLoggedIn && user && !user.isAccountVerify && !otpRef.current) {
      otp();
    }
   },[isLoggedIn,user])

  const handleverify=async(e)=>{
    try {
      e.preventDefault();
        const otp=inputRef.current.map((input)=>input.value).join("");
        const {data}=await axios.post('api/auth/email/verify',{otp});
        if(data.success){
          toast.success(data.message);
          await getUser();
          navigate('/');
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
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer mb-8"
      />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-90 text-md text-shadow-indigo-800">
        <h1 className="text-center text-xl">Email Verification</h1>
        <p className="text-sm">
          Enter your six digit otp for account verification
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
        <button onClick={handleverify} className="w-full p-2 text-sm sm:text-md bg-gradient-to-br from-blue-600 to-violet-400 rounded-lg">
          Verify email
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
