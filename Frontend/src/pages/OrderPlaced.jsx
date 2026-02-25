import React from 'react'

import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';


const OrderPlaced = () => {
      const navigate = useNavigate();     
      
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <FaCircleCheck className="text-green-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 text-center">Order Placed Successfully!</h1>
      <p className="text-gray-600 mt-2 text-center">Thank you for your order. We'll process it shortly.</p>

      <button className="mt-4 px-6 py-2 bg-[#ff4d2d] text-white rounded-md hover:bg-[#ff4d2d]/90 transition-colors" onClick={()=>navigate('/my-orders')}>View Order</button>
    </div>
  )
}

export default OrderPlaced