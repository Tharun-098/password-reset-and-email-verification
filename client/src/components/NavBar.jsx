import { useContext} from 'react';
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { DataContext } from '../context/DataContext';
import { toast } from 'react-toastify';
const NavBar = () => {
    const navigate=useNavigate();
    const {axios,user,setUser,setIsLoggedIn,isLoggedIn}=useContext(DataContext)
    const handleLogout=async(e)=>{
      try {
        e.preventDefault();
        const {data}=await axios.get('/api/auth/logout');
        if(data.success){
          toast.success(data.message);
          navigate('/login');
          setIsLoggedIn(null);
          setUser(undefined)
        }
        else{
          toast.error(data.message);          
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  return (
    <div className='flex justify-between items-center w-full p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} className='w-28 sm:w-32'/>
      {isLoggedIn?
      <div className='relative group bg-black flex items-center justify-center text-white w-8 h-8 rounded-full'>
        {user.username[0].toUpperCase()}
        <div className='absolute hidden group-hover:block top-0 right-0 z-10 rounded pt-10'>
          <ul className='list-none m-0 bg-gray-300 text-sm text-black'>
            <li onClick={handleLogout} className='px-2 py-1 cursor-pointer hover:bg-gray-100'>Logout</li>
          </ul>
        </div>
    </div>
    :<button className='flex items-center border border-gray-500 text-gray-800 gap-2 rounded-full px-6 py-2 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} alt="arrow" /></button>
    }
    </div>
  )
}

export default NavBar
