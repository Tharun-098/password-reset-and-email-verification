import { useContext } from "react"
import { assets } from "../assets/assets"
import { DataContext } from "../context/DataContext"

const Header = () => {
  const {user}=useContext(DataContext)
  return(
    <div className="flex flex-col items-center px-4 mt-20 text-gray-800 text-center">
        <img src={assets.header_img} className="w-36 h-36 rounded-full mb-6"/>
        <p className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">Hey {user?.username} <img src={assets.hand_wave} className="w-8 aspect-square"/></p>
        <h1 className="text-3xl sm:text-5xl font-semibold">Welcome to our platform</h1>
    </div>
  )
}
export default Header
