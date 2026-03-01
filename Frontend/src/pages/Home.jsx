import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard.jsx' 
import {DeliveryBoy} from '../components/DeliveryBoy.jsx'
import OwnerDashboard from '../components/OwnerDashboard.jsx'     
export default function Home(){
      const userData = useSelector(state=>state.user.userData);
  
      return(
           <div className='w-[100vw] min-h-[100vh] pt-[100px] flex flex-col  items-center bg-[#fff9f6]'>
                   
                   {userData && userData.role === "user" && <UserDashboard/>}
                   {userData && userData.role === "deliveryBoy" && <DeliveryBoy/>} 
                   {userData && userData.role === "owner" && <OwnerDashboard/>}

           </div>
      )
}