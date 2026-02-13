import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../Redux/ownerSlice.js'


const useGetMyShop = () => {
  const dispatch =  useDispatch();
  const {myShopData} = useSelector((state)=>state.owner);
   useEffect(()=> {
      
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
      
  },[])
}

export default useGetMyShop