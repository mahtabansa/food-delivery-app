import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../Redux/ownerSlice.js';
import { FaUtensils } from "react-icons/fa";
import { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';


const CreateEditShop = () => {
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const { myShopData } = useSelector((state) => state.owner);
      console.log("myshopData", myShopData)
      const { currentState, currentCity, currentAddress } = useSelector((state) => state.user);
      const [name, setName] = useState(myShopData?.name || "");
      const [city, setCity] = useState(myShopData?.city || currentCity || "");
      const [state, setState] = useState(myShopData?.state || currentState || "");
      const [address, setAddress] = useState(myShopData?.address || currentAddress || "");
      const [BackendImage, setBackendImage] = useState(null);
      const [FrontendImage, setFrontendImage] = useState(myShopData?.image || null);
      const [loading,setLoading] = useState(false);


      const handleImage = (e) => {
            try {
                  const file = e.target.files[0];

                  if (!file) return;

                  setBackendImage(file);

                  setFrontendImage(URL.createObjectURL(file));
                  console.log("BackendImage:", BackendImage);
            } catch (err) {
                  console.log("handle image is not working");
            }
      };

      const handleSubmit = async (e) => {
              setLoading(true);
            e.preventDefault();
            try {
                  const formData = new FormData();
                  formData.append("name", name)
                  formData.append("state", state)
                  formData.append("city", city)
                  formData.append("address", address)

                  if (BackendImage) {
                        formData.append("image", BackendImage);
                  }

                  const result = await axios.post(
                        "http://localhost:8000/api/shop/create-edit-shop",
                        formData,
                        {
                              withCredentials: true
                        }

                  );

                  dispatch(setMyShopData(result.data))
                  setLoading(false);
                  navigate('/')
            } catch (err) {
                  console.log("error during form form submission", err);
            }
      }



      return (
            <div className='min-h-screen flex justify-center items-center flex-col p-6 bg-gradient-to-br from-orange-50 relative to-white'>

                  <div className='absolute left-[20px] top-[20px] z-[10] mt-[10px] text-3xl '>
                        <IoMdArrowRoundBack size={35} className='text-[#ff4d2d]' onClick={() => navigate(-1)} />
                  </div>

                  <div className='max-w-lg w-full bg-white border border-orange-100 rounded-2xl shadow-xl p-8 '>

                        <div className='flex justify-center items-center flex-col '>
                              <div className='bg-orange-100 p-4 rounded-full mb-4'>
                                    <FaUtensils className='text-[#ff4d2d] w-16 h-16' />
                              </div>
                              <div className='text-2xl font-extrabold text-gray-900'>
                                    {myShopData ? "Edit shop" : "Add shop"}
                              </div>
                        </div>

                        <form className='space-y-5' onSubmit={handleSubmit} >
                              <div>
                                    <label htmlFor="name" className='block text-sm font-medium text-gray-900 mb-2'>name</label>
                                    <input type="text" placeholder='Enter Shop Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-orange-500 ' value={name} onChange={(e) => setName(e.target.value)} />
                              </div>

                              <div>
                                    <label htmlFor="image" className='block text-sm font-medium text-gray-900 mb-2'>Image</label>
                                    <input type="file" placeholder='Upload image' className='w-full px-4 py-2 border rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-orange-500 ' accept="image/*" onChange={handleImage} />
                              </div>
                              {FrontendImage &&

                                    <div className='mt-4'>
                                          <img src={FrontendImage} alt="shop Restaurant Image" className='w-full h-48 border rounded-lg object-cover ' />
                                    </div>
                              }

                              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:gap-5 lg:gap-5'>
                                    <div>
                                          <label htmlFor="state" className='block text-sm font-medium text-gray-900 mb-2'>State</label>
                                          <input type="text" placeholder='Enter State Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-orange-500 '  value={state} onChange={(e) => setState(e.target.value)} />
                                    </div>

                                    <div>
                                          <label htmlFor="city" className='block text-sm font-medium text-gray-900 mb-2'>City</label>
                                          <input type="text" placeholder='eg:bhopal ,bangalore' className='w-full px-4 py-2 border rounded-lg 
                                    focus:outline-none 
                                    focus:ring-2 focus:ring-orange-500 ' value={city} onChange={(e) => setCity(e.target.value)} />
                                    </div>
                              </div>


                              <div>
                                    <label htmlFor="address" className='block text-sm font-medium text-gray-900 mb-2'>Address</label>
                                    <input type="text" placeholder='eg:jahangirabad,near badi masjid ,bhopal' className='w-full px-4 py-2 border rounded-lg 
                                    focus:outline-none 
                                    focus:ring-2 focus:ring-orange-500 ' value={address} onChange={(e) => setAddress(e.target.value)} />
                              </div>
                              <button className='bg-[#ff4d2d] text-white font-semibold w-full hover:bg-orange-600 py-2 rounded-xl' 
                              disabled={loading}>
                                    {loading? <ClipLoader className='text-white' size={20}/>:"SAVE"}
                              </button>
                        </form>

                  </div>

            </div>
      )
}

export default CreateEditShop