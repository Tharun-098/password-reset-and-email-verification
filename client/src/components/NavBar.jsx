import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { toast } from 'react-toastify';

const NavBar = () => {
  const navigate = useNavigate();
  const { axios, user, setUser, setIsLoggedIn, isLoggedIn } = useContext(DataContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.get('/api/auth/logout');
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
        setIsLoggedIn(null);
        setUser(undefined);
        setMenuOpen(false); // Close dropdown
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-between items-center w-full p-4 sm:p-6 sm:px-24 absolute top-0 z-50 bg-white">
      <img src={assets.logo} className="w-28 sm:w-32" alt="logo" />

      {isLoggedIn ? (
        <div className="relative group">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center focus:outline-none"
          >
            {user.username[0].toUpperCase()}
          </button>

          {/* Dropdown: visible on hover (desktop) or if menuOpen is true (mobile) */}
          <div
            className={`absolute right-0 top-10 bg-gray-300 text-sm text-black rounded shadow z-10 pt-1 
              ${menuOpen ? 'block' : 'hidden'} group-hover:block`}
          >
            <ul className="list-none m-0">
              <li
                onClick={handleLogout}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center border border-gray-500 text-gray-800 gap-2 rounded-full px-6 py-2 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="arrow" />
        </button>
      )}
    </div>
  );
};

export default NavBar;
