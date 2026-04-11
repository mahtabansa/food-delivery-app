import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity } from '../Redux/userSlice'


const UseGetShopByCity = () => {
  const dispatch =  useDispatch();
   const url = import.meta.env.VITE_SERVER_URL;
  const {currentCity ,userData} = useSelector((state)=>state.user);

 useEffect(()=> {

  if(!currentCity || !userData) return;
      const getshopByCity = async() => {
       
            const result = await axios.get(`${url}/api/shop/get-shop-by-city/${currentCity}`,{withCredentials:true});
            console.log("result get shop in my city",result);
             if(!result){
                  console.log("resutl not found");
             }  
             dispatch(setShopsInMyCity([result.data]))
             
      } 
      getshopByCity()
      
  },[currentCity])
}

export default UseGetShopByCity;