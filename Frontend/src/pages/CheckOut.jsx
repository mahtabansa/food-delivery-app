import React, { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { CiLocationOn } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { setLocation } from '../Redux/mapSlice.js';
import axios from 'axios';
import { setAddress } from '../Redux/mapSlice.js';
import { MdDeliveryDining } from "react-icons/md";
 import { IoPhonePortraitOutline } from "react-icons/io5";
 import { FiCreditCard } from "react-icons/fi";
import { addMyOrder } from '../Redux/userSlice.js';
import { setMyorder } from '../Redux/userSlice.js';

function RecenterMap({ location }) {
      if (location.lat || location.log) {
            const map = useMap();
            map.setView([location.lat, location.log], map.getZoom(), { animate: true });
      }
}

const CheckOut = () => {
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const {TotalAmount,CardItems,Myorder} = useSelector(state => state.user);
      console.log("card items",CardItems)
      console.log("total amount",TotalAmount)
      const apikey = import.meta.env.VITE_GEOCODING_APIKEY;
      const { location, address } = useSelector(state => state.map);
      const [addressInput, setAddressInput] = useState(address || '');
      const [paymentMethod, setPaymentMethod] = useState("cod");
  
      const deliveryfees = TotalAmount>500? 0:40;

      const ondragend = (e) => {
            const marker = e.target;
            const lat = marker._latlng.lat;
            const log = marker._latlng.lng;
            dispatch(setLocation({ lat: lat, log: log }));
            getaddressByLatLog(lat, log)
      }
      const getaddressByLatLog = async (lat, log) => {
            try {

                  const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${log}&type=postcode&format=json&apiKey=${apikey}`);
                  const result = response.data.results[0].address_line1 || response.data.results[0].city;

                  const fullAddress = response.data.results[0].address_line2 + " " + response.data.results[0].address_line1 + " " + " " + response.data.results[0].state + " " + response.data.results[0].country
                  // this is the full address that we will save in the database and use it for delivery and other purposes
                  dispatch(setAddress(fullAddress));


            }
            catch (error) {
                  console.error("Error fetching address:", error);
                  return "Address not found";
            }
      }

      const getCurrentLocation = () => {
            navigator.geolocation.getCurrentPosition(async (postion) => {
                  const lat = postion.coords.latitude;
                  const log = postion.coords.longitude;
                  dispatch(setLocation({ lat: lat, log: log }));
                  getaddressByLatLog(lat, log)
            })
      }
      const getlatlogByAddress = async () => {
            try {

                  const response = fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apikey}`)
                        .then(resp => resp.json())
                        .then((geocodingResult) => {
                              console.log("Geocoding Result:", geocodingResult);
                              const { lon, lat } = geocodingResult.features[0].properties;
                              dispatch(setLocation({ lat: lat, log: lon }));
                        });


            }
            catch (err) {
                  console.log("errror occured during get lag and lat by city name", err);
            }
      }

      
      const handlePlaceOrder = async ()=>{
          await  axios.post("http://localhost:8000/api/order/place-order",{
                  CardItems,
                  totalAmount:TotalAmount + deliveryfees,
                  deliveryAddress:address,
                  longitude:location.log,
                  latitude:location.lat,
                  paymentMethod,
                
            },{withCredentials:true})
            .then(res => {
                  console.log("Order placed successfully:", res.data);
                  dispatch(setMyorder(res.data.order))
                  dispatch(addMyOrder(res.data.order));
                 
                  navigate("/order-placed");
            })
            .catch(err => {
                  console.error("Error placing order:", err);
            })
      }

      useEffect(() => {
            setAddressInput(address);

      }, [address ])

     
      return (
            <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center '>
                  {/* here will be back icons */}
                  <div className='flex  gap-[20px] mx-4 '>
                        <div className='z-10' onClick={() => navigate(-1)}>
                              <IoArrowBack size={35} className='text-[#ff4d2d] cursor-pointer' />
                        </div>
                  </div>


                  <div className='w-full max-w-[900px] flex  flex-col rounded-lg bg-white shadow-lg space-y-6'>
                        <h1 className='font-bold text-2xl text-gray-800 m-4 '>CheckOut</h1>
                        <section>
                              <h2 className='flex items-center gap-2 m-4'><CiLocationOn className='text-[#ff4d2d] font-bold text-xl' /> Delivery Location</h2>

                              <div className='gap-4 flex items-center m-4'>
                                    <input type="text" className='w-full rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter your Address..' value={addressInput} onChange={(e) => setAddressInput(e.target.value)} />
                                    <button className='bg-[#ff4d2d] text-white px-4 py-2 rounded-md hover:bg-[#ff4d2d]/90' onClick={getlatlogByAddress}>
                                          <IoSearchOutline size={20} />
                                    </button>

                                    <button className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer' onClick={getCurrentLocation}>
                                          <BiCurrentLocation onClick={getCurrentLocation} size={20} />
                                    </button>
                              </div>
                        </section>

                        <div className='rounded-lg bg-gray-100 p-4 m-4  '>
                              <div className='h-60 w-full '>

                                    <MapContainer center={[location.lat || 51.505, location.log || -0.09]} zoom={13} scrollWheelZoom={false} className="h-full w-full rounded-lg map-container">

                                          <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                          />
                                          <RecenterMap location={location} />
                                          <Marker position={[location.lat || 51.505, location.log || -0.09]} draggable={true} eventHandlers={{ dragend: ondragend }}>
                                                <Popup >
                                                      A pretty CSS3 popup. <br /> Easily customizable.
                                                </Popup>
                                          </Marker>
                                    </MapContainer>
                              </div>
                        </div>


                        <section>
                              <h2 className='text-lg font-semibold text-gray-800 m-6'>Payment Method</h2>

                              <div className='grid grid-cols-1 sm:grid-cols-2  gap-4 m-4'>
                                    <div className={`flex items-center gap-3 rounded-lg bg-gray-100 p-4 py-4 text-left  hover:bg-gray-200 ${paymentMethod == "cod" ? "border border-[#ff4d2d] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setPaymentMethod("cod")}>
                                          <div className='p-2 bg-green-100 rounded-full'>
                                                <MdDeliveryDining className='text-green-500' size={30} />
                                          </div>
                                          
                                          <div className='flex flex-col pb-1'>
                                                <h1 className='text-gray-700 text-lg font-medium'> Cash on Delivery</h1>
                                                <h1 className='text-gray-500 text-sm'>pay when you receive the order</h1>
                                          </div>
                                    </div>

                                    <div className={`flex items-center gap-3 rounded-lg bg-gray-100 p-4 py-4 text-left  hover:bg-gray-200 ${paymentMethod == "online" ? " border border-[#ff4d2d] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`} onClick={() => setPaymentMethod("online")}>
                                            <div className='p-2 bg-purple-100 rounded-full'>
                                                <IoPhonePortraitOutline className='text-purple-500' size={25} />
                                          </div>

                                           <div className='p-2 bg-blue-100 rounded-full'>
                                                <FiCreditCard className='text-blue-500' size={30} />
                                          </div>

                                          <div className='flex flex-col pb-1'>
                                                <h1 className='text-gray-700 text-lg font-medium'> UPI /Credit Card /Debit Card</h1>
                                                <h1 className='text-gray-500 text-sm'>pay securely online</h1>
                                          </div>
                                    </div>

                              </div>

                        </section>


                        <section>
                              <h2 className='text-lg font-semibold text-gray-800 m-6'>Summary</h2>
                              <div className='m-4 bg-gray-100 p-4 rounded-lg'>

                             
                              <div className=''>
                                    {CardItems.map((item,idx)=> (
                                     <div key={idx} className='flex justify-between'>
                                          <h3 className='text-gray-700'>{item.name} x {item.quantity}</h3>
                                          <h3 className='text-gray-700'>₹{item.price * item.quantity}</h3>
                                    </div>
                                    ))}

                                     <div className='flex justify-between'>
                                          <h3 className='text-gray-700'>Subtotal</h3>
                                          <h3 className='text-gray-700'>₹{TotalAmount}</h3>
                                    </div>
                                    <div className='flex justify-between'>
                                          <h3 className='text-gray-700'>Delivery Fee</h3>
                                          <h3 className='text-gray-700'>₹{deliveryfees}</h3>
                                    </div>


                                    <hr className='my-2 border-gray-200' />
                                    <div className='flex justify-between'>
                                          <h3 className='text-[#ff4d2d] font-bold text-xl '>Total</h3>
                                          <h3 className='text-[#ff4d2d] font-bold text-xl '>₹{TotalAmount + deliveryfees}</h3>
                                    </div>
                              </div>
                              </div>
                        </section>

                        <section>
                              <button className='w-[97%]  bg-[#ff4d2d] text-white py-2 p-4 m-4 rounded-md text-lg font-medium hover:bg-[#ff4d2d]/90 '  onClick={handlePlaceOrder}>
                                   {paymentMethod ==="cod"?"place order":"pay & place order"}
                              </button>
                        </section>

                  </div>
            </div>
      )
}

export default CheckOut