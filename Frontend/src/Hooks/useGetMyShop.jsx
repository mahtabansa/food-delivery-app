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
                  // return res.status(400).json({message:"shop not found"})
                  console.log("resutl not found");
             }  
             console.log(result.data)
             dispatch(setMyShopData(result.data))
            //  return res.status(200).json(result); 
      } 
    fetchShop();
      
  },[])
}

export default useGetMyShop