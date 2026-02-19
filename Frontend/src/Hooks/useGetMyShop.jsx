import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../Redux/ownerSlice.js'


const useGetMyShop = () => {
  const {userData} = useSelector((state)=>state.user);
  const dispatch =  useDispatch();
   useEffect(()=> {
        if(!userData) return;
      const fetchShop = async() => {
      
            const result = await axios.get("http://localhost:8000/api/shop/get-my",{withCredentials:true});
            console.log("use get my shop data result",result);
             if(!result){
                  console.log("resutl not found");
             }  
             console.log(result.data)
             dispatch(setMyShopData(result.data))
      } 
    fetchShop();
      
  },[userData])
}

export default useGetMyShop