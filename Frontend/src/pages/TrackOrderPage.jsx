import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { DeliveryBoyTracking } from './DeliveryBoyTracking';
import { socket } from '../socket.js';
 
const TrackOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
    const url = import.meta.env.VITE_SERVER_URL;
  const [currentOrder, setCurrentOrder] = useState();
  console.log("current order",currentOrder);
  const [deliveryLiveLocation, setDeliveryLiveLocation] = useState({});
 
  // ── Fetch order 
  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${url}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
    } catch (err) {
      console.log(`error while tracking order ${err}`);
    }
  };
 
 
  useEffect(() => {
    const handler = ({ deliveryBoyId, longitude, latitude }) => {
      setDeliveryLiveLocation((prev) => ({
        ...prev,
        [deliveryBoyId]: { lat: latitude, lon: longitude },
      }));
    };
 
    socket?.on('updateDeliveryLocation', handler);
    return () => socket?.off('updateDeliveryLocation', handler);
  }, [socket]);
 
  
  useEffect(() => {
    handleGetOrder();
  }, [orderId]);
 

  return (
    <div className='max-w-4xl p-4 mx-auto flex flex-col gap-6'>
 
      {/* Header */}
      <div className='flex gap-[20px] mx-4'>
        <div
          className='z-10 flex gap-4 flex-row justify-center items-center cursor-pointer'
          onClick={() => navigate(-1)}
        >
          <IoArrowBack size={35} className='text-[#ff4d2d]' />
          <h1 className='text-xl font-semibold'>Track Order</h1>
        </div>
      </div>
 
      {/* Shop orders */}
      {currentOrder?.shopOrder?.map((shopOrder, index) => {
 
        const deliveryBoyId  = shopOrder?.assignedDeliveryBoy?._id;
        const liveLocation   = deliveryLiveLocation?.[deliveryBoyId];
 
        return (
          <div
            key={index}
            className='bg-white p-4 rounded-2xl shadow-md border-orange space-y-4'
          >
            <div className='p-4'>
              <p>Shop: {shopOrder.shop.name}</p>
              <p className='font-semibold'>
                Item:{' '}
                <span>{shopOrder?.shopOrderItems?.map((i) => i.name).join(' , ')}</span>
              </p>
              <p>Total: {currentOrder?.totalAmount}</p>
              <p>Payment: {currentOrder?.payment === true ? 'Done' : 'Not Done'}</p>
 
              {/* Delivery info or delivered badge */}
              {shopOrder.status !== 'delivered' ? (
                <div className='border-orange-600 py-3'>
                  {shopOrder.assignedDeliveryBoy ? (
                    <>
                      <p className='text-sm font-semibold text-gray-600'>Delivery Boy Details:</p>
                      <p className='text-sm font-semibold text-gray-600'>
                        Name: {shopOrder.assignedDeliveryBoy.fullName}
                      </p>
                      <p className='text-sm font-semibold text-gray-600'>
                        Email: {shopOrder.assignedDeliveryBoy.email}
                      </p>
                      <p className='text-sm font-semibold text-gray-600'>
                        Mobile No.: {shopOrder.assignedDeliveryBoy.mobile}
                      </p>
                      <p className='text-sm font-semibold text-gray-600'>
                        Delivery Address: {currentOrder?.deliveryAddress}
                      </p>
                    </>
                  ) : (
                    <p>Order is not assigned yet to delivery boy</p>
                  )}
                </div>
              ) : (
                <p className='text-gray-800 font-bold text-lg'>Delivered</p>
              )}
 
              {/* Live map — uses socket live location, falls back to DB location */}
              {shopOrder?.assignedDeliveryBoy && shopOrder.status !== 'delivered' && (
                <div>
                  <DeliveryBoyTracking
                    data={{
                      deliveryBoyLocation: {
                        lat: liveLocation?.lat ?? shopOrder?.assignedDeliveryBoy?.location?.coordinates?.[1],
                        lon: liveLocation?.lon ?? shopOrder?.assignedDeliveryBoy?.location?.coordinates?.[0],
                      },
                      customerLocation: {
                        lat: currentOrder?.user?.location?.coordinates?.[1],
                        lon: currentOrder?.user?.location?.coordinates?.[0],
                      },
                    }}
                  />
                </div>
              )}
 
            </div>
          </div>
        );
      })}
    </div>
  );
};
 
export default TrackOrderPage;