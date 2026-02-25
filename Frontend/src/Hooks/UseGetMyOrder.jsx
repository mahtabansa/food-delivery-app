import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMyorder } from '../Redux/userSlice.js'


const UseGetMyOrders = () => {
  const {CardItems } = useSelector((state)=>state.user);
  const dispatch =  useDispatch();
   useEffect(()=> {
        if(!CardItems) return;
      const fetchShop = async() => {
      
            const result = await axios.get("http://localhost:8000/api/order/my-orders",{withCredentials:true});
            console.log("use get my orders data result",result);
             if(!result){
                  console.log("resutl not found");
             }  
             console.log("result.data",result.data)
             dispatch(setMyorder(result.data))
      } 
    fetchShop();
      
  },[CardItems ])
}

export default UseGetMyOrders