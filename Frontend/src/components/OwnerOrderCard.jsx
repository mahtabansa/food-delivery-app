import React from 'react'
import { useDispatch } from 'react-redux';
import { updateStatus } from '../Redux/userSlice.js';
import axios from 'axios';
import { useState } from 'react';

const OwnerOrderCard = ({ data }) => {
  const [availableBoys, setAvailableBoys] = useState([]);
     const url = import.meta.env.VITE_SERVER_URL;
  const dispatch = useDispatch();
  const handleupdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await
        axios.post(`${url}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true });
      console.log("results in the ownerDashBoard", result)
      dispatch(updateStatus({ orderId, shopId, status }))

      setAvailableBoys(result?.data?.availableDeliveryBoys)

    } catch (err) {
      console.log(`error occured during change status ${err}`)
    }
  }

  return (
    <div className='bg-white p-4 shadow-6 shadow-lg space-y-6 ' key={data._id}>
      <div className='flex flex-col justify-center'>
        <h1 className='text-md font-bold text-gray-600'>User Name . : {data?.user?.fullName}</h1>

      </div>

      <div className='flex flex-col justify-center'>
        <p className='text-md font-bold text-gray-600'>Delivery Address: {data?.deliveryAddress}</p>
        <p className='text-md font-bold text-gray-600'>Email: {data?.user?.email}</p>
        <p className='text-md font-bold text-gray-600'>Mobile No. : {data?.user?.mobile}</p>

      </div>

      {
        data.shopOrder.map((shoporder) => (
          <div key={shoporder._id} className='shadow-md rounded-lg space-y-2'>
            <div className='flex space-x-4 overflow-x-auto pb-2'>
              {shoporder.shopOrderItems.map((item) => (
                <div className='flex flex-start flex-col' key={item._id}>
                  <div className=' flex  flex-col rounded-lg p-2 bg-white gap-2'>
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

        <select className='text-[#ff4d2d] rounded-lg boder-[#ff4d2d] focus:outline-[#ff4d2d] p-2' onChange={(e) => handleupdateStatus(data?._id, data?.shopOrder[0]?.shop._id, e.target.value)}>

          <option value="pending">pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out for Delivery</option>

        </select>
      </div>

      {data?.shopOrder[0]?.status == "out of delivery" &&
        <div> {data?.shopOrder[0]?.assignedDeliveryBoy?<h1 className='font-bold text-xl pb-2'>Assigned Delivery Boy </h1>:<h1 className='font-bold text-xl pb-2'>Available delivery Boys </h1>} 

          {availableBoys?.length > 0 ? (availableBoys.map((b, index) =>
          (
            <div className='p-2 gap-3 bg-orange-50 border border-gray-600 rounded-lg shadow-md'>
              <p><span >Name:{b.name}</span>,<span> Mobile:{b.mobile}</span></p>
            </div>
             ))) :data?.shopOrder[0]?.assignedDeliveryBoy
            ? <div className='flex flex-col p-2 bg-gray-100 border border-orange-200 rounded-lg '><p>{data?.shopOrder[0]?.assignedDeliveryBoy
              .fullName}</p>  <p>{data?.shopOrder[0]?.assignedDeliveryBoy
              .mobile} </p> {data?.shopOrder[0]?.assignedDeliveryBoy.email}
</div> :
            <div>waiting for deivery boy to accept</div>
          }

        </div>
      }

      <h1 className='text-right font-bold'>SubTotal : {data?.shopOrder[0].subtotal}</h1>

    </div>
  )
}

export { OwnerOrderCard }
