import { useContext, useState } from "react"
import { assets } from "../assets/assets"
import { DataContext } from "../context/DataContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const LoginRegister = () => {
  const navigate=useNavigate();
  const [state,setState]=useState('login');
  const [username,setUserName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const {setIsLoggedIn,axios,user}=useContext(DataContext)
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
        if(state==='register'){
        const {data}=await axios.post('/api/auth/register',{username,email,password});
        if(data.success){
          setIsLoggedIn(true);
          toast.success(data.message);
          setEmail("");
          setPassword("");
          setUserName("");
          console.log(user)
          if(data.user.isAccountVerify){
            navigate('/');
          }else{
            navigate('/email')
          }
        }else{
          toast.error(data.message);
        }
      }else{
        const {data}=await axios.post('/api/auth/login',{email,password});
        if(data.success){
          setIsLoggedIn(true);
          toast.success(data.message);
          setEmail("");
          setPassword("");
          console.log(user)
          if(data.user.isAccountVerify){
            navigate('/');
          }else{
            navigate('/email')
          }
        }else{
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="flex  items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500">
      <img src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer mb-8"/>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-90 text-md text-shadow-indigo-800">
        <h1 className="text-center text-2xl">{state=="register"?'Sign up':'Sign in'}</h1>
        <form onSubmit={handleSubmit}>
          {state==='register' && (
            <div className="flex flex-col mb-4 gap-2 justify-center">
            <label htmlFor="name">username</label>
            <div className="relative">
            <img src={assets.person_icon} className="absolute w-4.5 top-2 left-2"/>
            <input name="name" type="text" placeholder="Enter your name" value={username} onChange={(e)=>setUserName(e.target.value)} className="w-full rounded-lg bg-gray-200 text-black p-2 pl-8 focus:ring-2 focus:ring-blue-500 outline-0"/>
            </div>
            </div>
          )}
          <div className="flex flex-col mb-4 gap-2 justify-center">
            <label htmlFor="email">email</label>
            <div className="relative">
            <img src={assets.mail_icon} className="absolute w-4.5 top-3.5 left-2"/>
            <input name="email" type="text" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-lg bg-gray-200 text-black p-2 pl-8 focus:ring-2 focus:ring-blue-500 outline-0"/>
            </div>
            </div>
            <div className="flex flex-col mb-2 gap-2 justify-center">
            <label htmlFor="password">password</label>
            <div className="relative">
            <img src={assets.lock_icon} className="absolute w-4.5 top-2 left-2"/>
            <input name='password' type="text" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-lg bg-gray-200 text-black p-2 pl-8 focus:ring-2 focus:ring-blue-500 outline-0"/>
            </div>
            </div>
            <p onClick={()=>navigate('/password')} className="font-light cursor-pointer">{state==='login' && 'forgot password'}</p>
            <button type="submit" className="p-3 hover:bg-blue-600 text-sm bg-blue-300 transition-all rounded-lg text-center w-full mt-2">{state==="register"?'sign up':'sign in'}</button>
        </form>
        <p className="text-center cursor-pointer">{state=="register"?'Already you have account':'Does not account lets'}<span className='ml-2 underline' onClick={()=>state=='register'?setState('login'):setState('register')}>{state=='register'?'sign in':'sign up'}</span></p>
      </div>
    </div>
  )
}

export default LoginRegister
