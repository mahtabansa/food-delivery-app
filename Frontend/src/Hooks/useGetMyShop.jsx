import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../Redux/ownerSlice.js'


const useGetMyShop = () => {
  const {userData , shopsInMyCity} = useSelector((state)=>state.user);
  const dispatch =  useDispatch();
   const url = import.meta.env.VITE_SERVER_URL;
   useEffect(()=> {
       
        if(!userData || userData.role !== "owner") return;
      const fetchShop = async() => {
      
            const result = await axios.get(`${url}/api/shop/get-my`,{withCredentials:true});
              console.log("get my shops",result)
             if(!result){
                  console.log("resutl not found");
             }  
             console.log(result.data)
             dispatch(setMyShopData(result.data))
      } 
    fetchShop();
      
  },[shopsInMyCity])
}

export default useGetMyShop