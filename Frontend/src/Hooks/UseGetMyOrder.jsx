import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMyOrder, setMyorder } from '../Redux/userSlice.js'


const UseGetMyOrders = () => {

  const dispatch =  useDispatch();
   useEffect(()=> {
      
      const fetchOrder = async() => {   
            const result = await axios.get("http://localhost:8000/api/order/my-orders",{withCredentials:true});
           
             if(!result){
                  console.log("resutl not found");
             }  
             dispatch(setMyorder( result.data))
      } 
    fetchOrder();
      
  },[])
}

export default UseGetMyOrders