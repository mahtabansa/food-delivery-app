import React from 'react'
import { CiSearch } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useState } from 'react';

function Navbar() {
      const userData = useSelector(state=>state.user.userData);
  

      // const {count} = useSelector(state => state.user);
      //     console.log(count);
      const [search, setSearch] = useState("");
      return (
            <div className="w-full h-[80px] flex items-center justify-between
             md:justify-center gap-[30px] px-[20px]
              fixed top-0 z-[99999] bg-[#fff9f6] overflow-visible">

                  <h1 className="text-3xl font-extrabold mb-2 text-[#ff4d2d]">Vingo</h1>
               
                   <div className='hidden md:flex lg:flex md:w-[60%] lg:w-[40%] h-[70px] 
                     bg-white shadow-xl rounded-lg items-center gap-[20px] '>
                        <div className='flex items-center w-[30%] overflow-hidden 
                        gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                              <FaLocationDot size={25} className='text-[#ff4d2d]' />
                              <div className='w-[80%] text-gray-600 truncate'>Jhansi</div>

                        </div>

                        <div className="flex w-[80%] gap-[10px] items-center ">
                              <CiSearch className='flex font-extrabold items-center text-[#ff4d2d]'
                                    size={20} />
                              <input type="text" placeholder='search delicious food .....'
                                    className='hover:none px-[10px] text-gray-700 outline-0 w-full' name='search' 
                                    onChange={(e)=>setSearch(e.target.value)}/>
                        </div>
                    </div>
                  

                 <div className='flex items-center gap-[20px]  '> 
                   <CiSearch className='flex font-extrabold items-center text-[#ff4d2d] cursor-pointer md:hidden lg:hidden'
                                    size={20}/>     
                  <div className='relative cursor-pointer'>
                        <IoCartOutline className='text-[#ff4d2d] cursor-pointer text-2xl' />
                        <span className='absolute right-[-9px] top-[-12px] text-[#ff4d2d] '>0</span>
                  </div>
                  <button className='hidden md:block px-3 py-2 rounded-lg bg-[#ff4d2d]/10 
            text-[#ff4d2d]'>My Order</button>
                  <div className='w-[40px] h-[40px] bg-[#ff4d2d] rounded-3xl flex items-center justify-center text-white font-bold text-xl '>
                    {userData?userData.fullName.slice(0,1).toUpperCase():null}
                  </div>
                  </div> 
            </div>
      )
}
export default Navbar;