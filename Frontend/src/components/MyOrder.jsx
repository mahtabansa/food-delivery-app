import React, { useEffect } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { OwnerOrderCard } from './OwnerOrderCard.jsx'
import { UserOrderCard } from './UserOrderCard.jsx'
import { setMyorder, updateRealTimeOrderStatus } from '../Redux/userSlice.js'
import { socket } from '../socket.js'
import { addMyOrder } from '../Redux/userSlice.js'

const MyOrder = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { Myorder, userData } = useSelector((state) => state.user);
  const orders = Myorder?.orders || [];

useEffect(() => {
 
  const handleNewOrder = (data) => {
    console.log("New order received:", data);
    

     const ownerIdFromSocket = data?.shopOrder?.[0]?.owner._id; 

  if (String(ownerIdFromSocket) === String(userData?._id)) {
      dispatch(addMyOrder(data)); 
    }
  };

 
socket?.on('update-status',({orderId,shopId,status,userId})=>{
     console.log("orderId,shopId,status,userId",orderId,shopId,status,userId);
     if(userId===userData._id){
      dispatch(updateRealTimeOrderStatus({orderId,shopId,status,userId}));
     }

})
  

  socket.on("newOrder", handleNewOrder);
 
  return () => {
    socket.off("newOrder", handleNewOrder);
        socket.off('update-status');

  };
}, [dispatch, userData?._id]);


  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex  justify-center '>
      <div className='w-full max-w-[800px] p-4 '>

        <div className='flex justify-center items-center gap-[20px] mb-6 '>
          <div className=' z-10' onClick={() => navigate(-1)}>
            <IoArrowBack size={35} className='text-[#ff4d2d] cursor-pointer' />
          </div>
          <h1 className='text-2xl font-bold text-start text-[#ff4d2d]'>My Orders</h1>
        </div>

        <div className='space-y-6'>
          <div className='space-y-6'>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">if order not shown then please refresh the page  </p>
            ) : (
              orders?.map((order) => (
                userData.role === "user"
                  ? <UserOrderCard data={order} key={order._id} />
                  : <OwnerOrderCard data={order} key={order._id} />
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

export default MyOrder


