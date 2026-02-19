import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity } from '../Redux/userSlice'


const UseGetShopByCity = () => {
  const dispatch =  useDispatch();
  const {currentCity} = useSelector((state)=>state.user);

 useEffect(()=> {

  if(!currentCity) return;
      const getshopByCity = async() => {
       
            const result = await axios.get(`http://localhost:8000/api/shop/get-shop-by-city/${currentCity}`,{withCredentials:true});
            console.log(result);
             if(!result){
                  console.log("resutl not found");
             }  
             dispatch(setShopsInMyCity([result.data]))
             
      } 
      getshopByCity()
      
  },[currentCity])
}

export default UseGetShopByCity;