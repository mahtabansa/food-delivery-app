import { useSelector } from 'react-redux';
import Navbar from './Navbar.jsx'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { data } from 'react-router-dom';
import { DeliveryBoyTracking } from '../pages/DeliveryBoyTracking.jsx';
import { socket } from '../socket.js';
import { Fragment } from 'react';
function DeliveryBoy() {
      const { userData, currentAddress } = useSelector((state) => state.user);
      const [availableAssignments, setAvailableAssignment] = useState(null);
      const [currentOrder, setCurrentOrder] = useState();
      const [showOtpBox, setshowOtpBox] = useState(false);
      const [deliveryotp, setdeliveryotp] = useState("");

      console.log("currentOrder", currentOrder);
      console.log("availableAssignments", availableAssignments);


useEffect(()=> {
            if(userData.role !=="deliveryBoy" || !socket) return;
            let watchId;
            if(navigator.geolocation){
               watchId =   navigator.geolocation.watchPosition((position)=>{
                        let latitude = position.coords.latitude;
                        let longitude = position.coords.longitude;
                        socket.emit('updateLocation',{userId:userData._id,latitude,longitude})

                  }),
                  (errr)=>{
                        console.log(errr)
                  },
                 {enableHighAccurecy:true}
                  
            }

            return()=>{
                  if(watchId) navigator.geolocation.clearWatch(watchId);
            }
},[socket,userData])




      const getAssignment = async () => {
            try {
                  const result = await axios.get("http://localhost:8000/api/order/get-assignmets", { withCredentials: true });
                  console.log("Delivery assignment", result.data);
                  setAvailableAssignment(result.data)
                  getCurrentOrder();
            }
            catch (err) {
                  console.log(err);
            }
      }

      const getCurrentOrder = async () => {
            const result = await axios.get("http://localhost:8000/api/order/get-current-order", { withCredentials: true });

            setCurrentOrder(result);
      }

      useEffect(() => {
            const handler = (data) => {
                  console.log("data in the delivery boy socket listener", data)
                  setAvailableAssignment((prev) => [...prev, data])
            }

            socket?.on("newAssignment", handler)

            return () => {
                  socket?.off("newAssignment", handler)
            }
      }, [socket, userData])

      useEffect(() => {
            getAssignment()
            getCurrentOrder()
      }, [userData]
      )

      const acceptOrder = async (assignmentId) => {
            console.log("assignmentId in frontend", assignmentId)
            try {
                  const result = await axios.get(`http://localhost:8000/api/order/accept-order/${assignmentId}`, { withCredentials: true });
                  console.log("result", result)
            } catch (err) {
                  console.log(`error while accept order ${err}`)
            }
      }


      const sendotp = async () => {

            try {
                  const result = await axios.post("http://localhost:8000/api/order/send-delivery-otp",
                        { shopOrderId: currentOrder.data.shopOrder._id, orderId: currentOrder.data._id }, { withCredentials: true });
                  console.log("result", result)
                  if (result) {
                        setshowOtpBox(true)
                  }

            } catch (err) {
                  console.log(`error while send otp ${err}`)
            }
      }


      const handleVerifyotp = async () => {

            try {
                  const result = await axios.post(`http://localhost:8000/api/order/verify-delivery-otp`,
                        { shopOrderId: currentOrder.data.shopOrder._id, orderId: currentOrder.data._id, otp: deliveryotp }, { withCredentials: true });
                  console.log("result", result)


            } catch (err) {
                  console.log(`error while send otp ${err}`)
            }
      }
      return (
            <div className="flex  flex-col w-screen min-h-screen gap-5 items-center bg-[#fff9f6] overflow-y-auto">
                  <Navbar />

                  <div className='w-full max-w-[800px] flex flex-col items-center gap-5 rounded-lg'>
                        <div className='bg-white rounded-2xl shodow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
                              <h1 className='text-[#ff4d2d] font-semibold text-center text-xl md:text-2xl lg:text-2xl '>Welcome to {userData.
                                    fullName
                              }</h1>
                              <span className='tex-center text-gray-400'>Current Address ,{currentAddress}</span>
                        </div>
                        {!currentOrder &&
                              <Fragment>
                                    <h1 className='text-2xl font-bold'>Available Orders</h1>
                                    {availableAssignments?.length > 0 ? availableAssignments.map((order) => (

                                          <div className='bg-white w-[90%] border border-orange-100 rounded-lg gap-2 flex flex-col p-3' key={availableAssignments?._id}>

                                                <span className='text-xl font-bold text-gray-700'>{order?.shopName}</span>
                                                <div className='flex justify-between'>
                                                      <span className='text-gray-500'>{order?.deliveryAddress}</span>
                                                      <button className='mx-5 py-1 px-4 bg-[#ff4d2d] rounded-lg text-white' onClick={() => acceptOrder(order.assignmentId
                                                      )}>Accept</button>
                                                </div>


                                                <span className='text-gray-500'>{order?.items?.length} item | {order?.
                                                      subtotal
                                                } ₹</span>


                                          </div>
                                    ))
                                          : <div>Therer is no any available order </div>}

                              </Fragment>
                        }

                        {currentOrder &&
                              <div className='bg-white rounded-lg w-[90%] shadow-lg p-5 border border-orange-100'>
                                    <h1 className='text-lg font-bold mb-3'>📦Current Order</h1>

                                    <div className='border rounded-lg p-4 mb-3'>
                                          <p className='text-sm  font-bold'>{currentOrder?.data?.shop?.name}</p>
                                          <p className='text-sm  font-bold'>Quantity {currentOrder?.data?.shopOrder?.shopOrderItems?.length} | SubTotal{currentOrder?.data?.shopOrder?.subtotal}</p>
                                          <p className='text-sm  font-bold'>{currentOrder?.data?.deliveryAddress}</p>

                                    </div>
                                    <DeliveryBoyTracking data={currentOrder} key={data._id} />
                                    {!showOtpBox ? <div className='w-[100%]'>
                                          <button className='w-full  bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all duration-200 text-white py-2 active:scale-95' onClick={sendotp}>Mark As delivered</button>
                                    </div> :
                                          <div className='border border-orange-100 rounded-lg my-2'>
                                                <p className='font-semibold text-sm mb-3 '>Opt sent to user <span className='text-orange-500 px-2'>{currentOrder?.data?.user?.fullName}</span></p>
                                                <input type="text" placeholder='Enter Otp here' className=' py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 w-full mb-3 px-2' onChange={(e) => setdeliveryotp(e.target.value)} />

                                                <button className='w-full  bg-orange-500  rounded-lg font-semibold transition-all duration-200 text-white py-2' onClick={handleVerifyotp}>SUBMIT OTP</button>
                                          </div>
                                    }




                              </div>

                        }



                  </div>

            </div>

      )
}
export { DeliveryBoy };