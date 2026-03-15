import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5';
import { useState } from 'react';
import { DeliveryBoyTracking } from './DeliveryBoyTracking';
import { useNavigate } from 'react-router-dom';
const TrackOrderPage = () => {
      const { orderId } = useParams();
      const [currentOrder, setCurrentOrder] = useState();
      const navigate = useNavigate();
      const handleGetOrder = async () => {
            try {
                  const result = await axios.get(`http://localhost:8000/api/order/get-order-by-id/${orderId}`, { withCredentials: true });
                  console.log("result order", result);
                  setCurrentOrder(result.data)
            } catch (err) {
                  console.log(`error while tracking order ${err}`)
            }
      }

      useEffect(() => {
            handleGetOrder();
      }, [orderId])
      return (
            <div className='max-w-4xl p-4 mx-auto flex flex-col gap-6'>
                  <div className='flex  gap-[20px] mx-4 '>
                        <div className='z-10 flex  gap-4 flex-row justify-center items-center' onClick={() => navigate(-1)}>
                              <IoArrowBack size={35} className='text-[#ff4d2d] cursor-pointer' />
                              <h1 className='text-xl font-semibold'>Track Order</h1>
                        </div>
                  </div>

                 {currentOrder && currentOrder?.shopOrder?.map((shopOrder,index) => (
                        <div className='bg-white p-4 rounded-2xl shadow-md border-orange space-y-4' key={index}> 
                              <div className='p-4'>
                                    <p>Shop:{shopOrder.shop.name}</p>
                        
                                     <p className='font-semibold'>Item:<span>{shopOrder?.shopOrderItems?.map(i=>i.name).join(" , ") }</span></p>
                                     <p>Total :{currentOrder?.totalAmount}</p>
                                     <p>payment:{currentOrder?.payment===true?"Done":"Not Done"}</p>

                                          {shopOrder.status !== "delivered" ? <div className=' border-orange-600 py-3'>  
                                          {shopOrder.assignedDeliveryBoy ? <>
                                           <p className='text-sm font-semibold text-gray-600'>Delivery Boy Details:</p>
                                           <p className='text-sm font-semibold text-gray-600'>Name: {shopOrder.assignedDeliveryBoy.fullName}</p>
                                           <p className='text-sm font-semibold text-gray-600'>Email: {shopOrder.assignedDeliveryBoy.email}</p>
                                            <p className='text-sm font-semibold text-gray-600'>Mobile No. :{shopOrder.assignedDeliveryBoy.mobile}</p>
                                            
                                                <p className='text-sm font-semibold text-gray-600'>Delivery Address :{currentOrder?.deliveryAddress}</p></>
                                            :<p>Order is not assigned yet to delivery boy</p>
                                            }
                                     </div> :<p className='text-gray-800 font-bold text-lg'>delivered</p> }
                                     


                                            {   
                                               ( shopOrder?.assignedDeliveryBoy  && shopOrder.status !== "delivered" ) &&
                                                <div>
                                                <DeliveryBoyTracking data={{
                                                      deliveryBoyLocation:{
                                                            lat:shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                                            lon:shopOrder.assignedDeliveryBoy.location.coordinates[0]
                                                      },
                                                      customerLocation:{lat:currentOrder?.user.location.coordinates[1],
                                                                        lon:currentOrder?.user.location.coordinates[0]
                                                      }
                                                      }}/>
                                                </div>
                                            }
                                           
                              </div>


                             
                        </div>
                  ))

                  }



            </div>
      )
}

export default TrackOrderPage