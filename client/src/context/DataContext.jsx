import { createContext, useEffect, useState } from "react";
import axios from 'axios';
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials=true;
export const DataContext=createContext({});

export const DataProvider=({children})=>{
    console.log(import.meta.env.VITE_BACKEND_URL)
    const [isLoggedIn,setIsLoggedIn]=useState(null);
    const [user,setUser]=useState(undefined);
    const userAuthentication=async()=>{
         try {
            const {data}=await axios.get('/api/auth/isAuth');
            if(data.success){
                setIsLoggedIn(true);
            }
         } catch (error) {
             setIsLoggedIn(false);            
         }
    }
    const getUser=async()=>{
        try{
            const {data}=await axios.get('/api/user');
            if(data.success){
                setUser(data.userData);
            }else{
                setUser(undefined);
            }
        }catch(error){
            setUser(undefined);
        }
    }

    useEffect(()=>{
        userAuthentication();
    },[])
    useEffect(()=>{
        getUser();
    },[isLoggedIn])
    console.log(user);
    return (
        <DataContext.Provider value={{getUser,axios,setUser,user,isLoggedIn,setIsLoggedIn}}>
            {children}
        </DataContext.Provider>
    )
}