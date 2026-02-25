import React from 'react'
import { useDispatch } from 'react-redux';
import { updateStatus } from '../Redux/userSlice.js';
import axios from 'axios';
const OwnerOrderCard = ({ data }) => {
  const dispatch =  useDispatch();
  const handleupdateStatus = async( orderId,shopId,status)=> {
     try{
      const result = await
        axios.post(`http://localhost:8000/api/order/update-status/${orderId}/${shopId}`,{status},{withCredentials:true});
        console.log("resutl",result)
        dispatch(updateStatus({orderId,shopId,status}))
 
     } catch(err){
      console.log(`error occured during change status ${err}`)
     }
  }

  return (
    <div className='bg-white p-4 shadow-6 shadow-lg space-y-6 '>
      <div className='flex flex-col justify-center'>
        <h1 className='text-md font-bold text-gray-600'>User Name . : {data?.user?.fullName}</h1>
      
      </div>

      <div className='flex flex-col justify-center'>
        <p className='text-md font-bold text-gray-600'>Delivery Address: {data?.deliveryAddress}</p>
        <p className='text-md font-bold text-gray-600'>Email: {data?.user?.email}</p>
        <p className='text-md font-bold text-gray-600'>Mobile No. : {data?.user?.mobile}</p>

      </div>

      {
        data.shopOrder.map((shoporder, index) => (
          <div key={index} className='shadow-md rounded-lg space-y-2'>
            <div className='flex space-x-4 overflow-x-auto pb-2'>
              {shoporder.shopOrderItems.map((item, index) => (
                <div className='flex flex-start flex-col'>
                  <div key={index} className=' flex  flex-col rounded-lg p-2 bg-white gap-2'>
                    <img src={item.item.image} alt={item.item.name} className='h-20 rounded-md object-cover' />
                     <p className='text-md font-bold text-gray-600'>Food Name: {item?.item.name}</p>
                   <p className='text-md font-bold text-gray-600'>Food Type: {data?.shopOrder[0].shopOrderItems[0].foodType}</p>
                  <p className='text-md font-bold text-gray-600'>Quantity: {data?.shopOrder[0].shopOrderItems[0].quantity}</p>
                   <p className='text-md font-bold text-gray-600'>Price for One: {data?.shopOrder[0].shopOrderItems[0].item.price}</p>
                  </div>

                   
                </div>
              ))}
            </div>

          </div>


        ))
      }

      <div className="flex justify-between">
        <span className='text-[#ff4d2d]'>Status: {data?.shopOrder[0].status}</span>

        <select className='text-[#ff4d2d] rounded-lg boder-[#ff4d2d] focus:outline-[#ff4d2d] p-2' onChange={(e)=>handleupdateStatus(data?._id,data?.shopOrder[0]?.shop._id ,e.target.value)}>
           <option value="">change</option>
          <option value="pending">pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out for Delivery</option>

        </select>
      </div>

      <h1 className='text-right font-bold'>SubTotal : {data?.shopOrder[0].subtotal}</h1>

    </div>
  )
}

export { OwnerOrderCard }
