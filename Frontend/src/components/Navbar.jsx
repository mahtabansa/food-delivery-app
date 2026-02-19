import React from 'react'
import { CiSearch } from "react-icons/ci";
import { FaLocationDot, FaS } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { shallowEqual, useSelector } from 'react-redux';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RxCross1 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import setUserData, { setCurrentCity } from '../Redux/userSlice.js';
import { LuReceipt } from "react-icons/lu";

function Navbar() {
      const { userData, city } = useSelector(state => state.user);
      const { myShopData } = useSelector(state => state.owner);
      const [showInfo, setShowInfo] = useState(false);
      const [showSearch, setShowSearch] = useState(false);
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const primaryColor = "#ff4d2d";
      const hoverColro = "#e64323";

      const handlelogout = async () => {
            const user = await axios.post('http://localhost:8000/api/auth/signout', {}, { withCredentials: true });
            console.log("logout response", user);
            dispatch(setUserData(null));
            dispatch(setCurrentCity(null));
            navigate("/signin");
      }

      return (
            <div className="w-screen h-[80px] flex items-center justify-between
             md:justify-center gap-[30px]
              fixed top-0 z-[99999] bg-[#fff9f6] overflow-visible ">


                  {userData.role === "user" && showSearch && <div className='flex flex-row fixed top-[90px] w-[90%] h-[70px] md:hidden lg:hidden 
                     bg-white shadow-xl rounded-lg items-center gap-[20px] '>
                        <div className='flex items-center  overflow-hidden 
                        gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                              <FaLocationDot size={25} className='text-[#ff4d2d]' />
                              <div className='text-gray-600 truncate'>{city}</div>

                        </div>

                        <div className="flex gap-[10px] items-center ">

                              <CiSearch className='flex font-extrabold items-center text-[#ff4d2d] w-[80%]'
                                    size={20} onClick={() => setShowSearch(false)} />

                              <input type="text" placeholder='search delicious food .....'
                                    className='hover:none px-[5px] text-gray-700 outline-0' name='search'
                              />
                        </div>
                  </div>

                  }


                  <h1 className="text-3xl font-extrabold mb-2 text-[#ff4d2d]">Vingo</h1>
                  {userData.role === "user" &&
                        <div className='hidden md:flex lg:flex md:w-[60%] lg:w-[40%] h-[70px] 
                     bg-white shadow-xl rounded-lg items-center gap-[20px] '>
                              <div className='flex items-center w-[30%] overflow-hidden 
                        gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                                    <FaLocationDot size={25} className='text-[#ff4d2d]' />
                                    <div className='w-[80%] text-gray-600 truncate'>{city}</div>

                              </div>

                              <div className="flex w-[80%] gap-[10px] items-center ">
                                    <CiSearch className='flex font-extrabold items-center text-[#ff4d2d]'
                                          size={20} onClick={() => setShowSearch(prev => !prev)} />
                                    <input type="text" placeholder='search delicious food .....'
                                          className='hover:none px-[10px] text-gray-700 outline-0 w-full' name='search'
                                    />
                              </div>
                        </div>
                  }
                  {/* for small devices */}
                  <div className='flex items-center gap-[20px]  '>
                        {userData.role === "user" && showSearch ? <RxCross1 onClick={() =>
                              setShowSearch(false)} /> : <CiSearch className='flex font-                          
                             extrabold items-center text-[#ff4d2d] cursor-pointer md:hidden lg:hidden'
                                    size={20} onClick={() => setShowSearch(true) }  />
                        }


                        {userData.role === "user" && <div className='relative cursor-pointer'>
                              <IoCartOutline className='text-[#ff4d2d] cursor-pointer text-2xl' />
                              <span className='absolute right-[-9px] top-[-12px] text-[#ff4d2d] '>0</span>
                        </div>
                        }


                        {/* For Owner */}
                        {userData.role === "owner" ? <>{ myShopData && <div className=' p-2 text-[#ff4d2d] flex justify-center 
                        items-center gap-2 rounded-lg bg-[#ff4d2d]/10  '> <FaPlus className='font-semibold' onClick={()=>navigate('/add-item')} />
                              <button className='hidden md:flex lg:flex font-semibold' onClick={()=>navigate('/add-item')}>Add Food Item</button>
                        </div>}

                              <div className='relative p-2 text-[#ff4d2d] flex justify-center 
                        items-center gap-2 rounded-lg bg-[#ff4d2d]/10 outline-none '>
                                    <LuReceipt className='font-semibold h-[20px] w-[20px]' />
                                    <span className='font-semibold hidden md:flex lg:flex'>My Orders</span>
                                    <span className='absolute -right-2 -top-2 text-xs font-bold text-white
                                    bg-[#ff4d2d] rounded-lg px-[6px] py-[1px]'>0</span>
                              </div>

                        </> : (
                              <>
                                    <button className='hidden md:block px-3 py-2 rounded-lg bg-[#ff4d2d]/10 
                                    text-[#ff4d2d]'>My Order</button>
                              </>
                        )}




                        <div className='w-[40px] h-[40px] bg-[#ff4d2d] rounded-3xl flex items-center 
                                justify-center text-white font-bold text-xl ' onClick={() => setShowInfo(prev => !prev)}>
                              {userData ? userData.fullName.slice(0, 1).toUpperCase() : null}
                        </div>


                        {showInfo && <div className=' flex flex-col fixed  top-20 right-[3%]  md:right-[5%] lg:right-[20%] 
                        rounded-lg bg-white h-[50vh] w-[200px] z-[999999] shadow-lg    '>
                              <button className='absolute black right-[10px] top-[10px]' onClick={()=>navigate(-1)}><RxCross1 className='text-orange-600 text-xl font-extrabold'></RxCross1></button>
                              <div className='w-full h-[50px] flex  items-center justify-center text-lg font-bold 
                                 text-gray-700 border-b-[1px] border-gray-400'>My Profile
                              </div>
                        

                              <h1 className='p-2 truncate '>{userData ? userData.fullName : "Guest"}</h1>
                              <div className='p-2 text-[#ff4d2d] hover:text-red-500 cursor-pointer text-md font-semibold'>my order</div>
                              <div className='p-2 text-[#ff4d2d] hover:text-red-500 cursor-pointer text-md font-semibold'
                                    onClick={() => handlelogout()}>logout</div>
                        </div>
                        }
                  </div>

            </div>
      )
}
export default Navbar;