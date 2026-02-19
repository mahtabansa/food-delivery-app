import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../Redux/ownerSlice.js';
import { FaUtensils } from "react-icons/fa";
import { useState } from 'react';
import axios from 'axios';
import serverUrl from '../App.jsx'
import { ClipLoader } from 'react-spinners';

const AddItem = () => {
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const { myShopData } = useSelector((state) => state.owner);
      const { currentState, currentCity, currentAddress } = useSelector((state) => state.user);
      const [itemname, setItemName] = useState("");
      const [price, setprice] = useState("");
      const [BackendImage, setBackendImage] = useState(null);
      const [FrontendImage, setFrontendImage] = useState(null);
      const [category, setCategory] = useState("");
      const [foodType, setFoodType] = useState("");
      const [Loading,setLoading] = useState(false);
     

      const categories = [
            "Snacks",
            "Main Courses",
            "Deserts",
            "Pizzas",
            "Burger",
            "Sandwihces",
            "North India",
            "South India",
            "Fast Foods",
            "Chinees",
            "Others"
      ];

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
                  formData.append('name', itemname)
                  formData.append('price', price)
                  formData.append("category", category)
                  formData.append("foodType", foodType)

                  if (BackendImage) {
                        formData.append("image", BackendImage);
                  }

               
                  const result = await axios.post(
                        "http://localhost:8000/api/item/add-item",
                        formData,
                        {
                              withCredentials: true  
                        }
                  );
                  console.log("addd itemresult",result)
                  dispatch(setMyShopData(result.data))
                  setLoading(false);
                  navigate("/");
                  
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
                                    Add Food
                              </div>
                        </div>

                        <form className='space-y-5' onSubmit={handleSubmit} >
                              <div>
                                    <label htmlFor="name" className='block text-sm font-medium text-gray-900 mb-2'>Food Name</label>
                                    <input type="text" placeholder='Enter Food Name' className='w-full px-4 py-2 border rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-orange-500 ' value={itemname} onChange={(e) => setItemName(e.target.value)} />
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


                              <div>
                                    <label htmlFor="foodType" className='text-sm font-medium text-gray-900 mb-2'>
                                          Select Food Type
                                    </label>

                                    <select
                                          className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                                          name="foodType"              
                                          value={foodType}
                                          onChange={(e) => setFoodType(e.target.value)}
                                    >
                                          <option value="">Select Type</option>
                                          <option value="veg">Veg</option>
                                          <option value="non-veg">Non-Veg</option>
                                    </select>
                              </div>


                              <div>
                                    <label htmlFor="category" className='text-sm font-medium text-gray-900 mb-2'>Select Sategory</label>
                                    <select className='w-full px-4 py-2 border rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-orange-500 rounded-md mt-2 ' name='category' value={category} onChange={(e) => setCategory(e.target.value)} >

                                          <option value="" className=' text-gray-100'>Select Category</option>

                                          {categories.map((cate, idx) => (
                                                <option key={idx} value={cate} className='border rounded-md'>{cate}</option>
                                          ))}
                                    </select>

                              </div>

                              <div>
                                    <label htmlFor="price" className='block text-sm font-medium text-gray-900 mb-2'>Price</label>
                                    <input type="text" placeholder='set your price,min-0' className='w-full px-4 py-2 border rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-orange-500 ' value={price} onChange={(e) => setprice(e.target.value)} />
                              </div>



                              <button className='bg-[#ff4d2d] text-white font-semibold w-full hover:bg-orange-600 py-2 rounded-xl' disabled={Loading}>
                                    {Loading ? <ClipLoader size={20} color='white'/>:"SAVE"}
                              </button>
                        </form>

                  </div>

            </div>
      )
}

export default AddItem;