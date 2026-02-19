import React from 'react'
import { MdOutlineEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {setMyShopData} from '../Redux/ownerSlice.js'
import axios from 'axios';


// data is comming from ownerDashboard.jsx as prop
const OwnerItemCard = ({ data }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const deleteHandle = async()=> {
      const result =   axios.get(`http://localhost:8000/api/item/delete-item/${data._id}`,{withCredentials:true});

      console.log(result);

      dispatch(setMyShopData(result.data))
      
       navigate("/");
    }

      return (
            <div className='flex bg-white border rounded-lg mt-4 shadow-md overflow-hidden border-[#ff4d2d] w-full max-w-3xl'>

                  <div className='w-50 bg-gray-50 h-[70px] md:h-[100px] lg:h-[100px]'  >
                        <img src={data?.image} alt="food image" className='object-cover rounded-lg image-fluids'  />
                  </div>

                  <div className='flex flex-col justify-between p-2   flex-1'>
                        <div  >
                              <h1 className='text-base font-semibold '>Food Name: {data.name}</h1>
                              <p> <span className='font-medium text-gray-70'>Category: </span>{data.category}</p>
                              <p> <span className='font-medium text-gray-70'>Food Type: </span>{data.foodType}</p>
                        </div>

                        <div className='flex justify-between items-center'>

                              <div className='font-medium text-gray-70'> Price : {data.price}</div>
                              <div className='flex items-center'>
                                    <div className='flex justify-between items-center'>
                                          <div className='p-2 text-[#ff4d2d] cursor-pointer rounded-full hover:bg-orange-200 ' 
                                          onClick={()=>navigate(`/edit-item/${data._id}`)}>
                                                <MdOutlineEdit size={20} /> 
                                          </div>

                                          <div className='p-2 text-[#ff4d2d] cursor-pointer rounded-full hover:bg-[#ff4d2d'>  
                                                <FaTrashAlt size={20}  onClick={deleteHandle} /></div>

                                    </div>
                              </div>
                        </div>
                  </div>

            </div>
      )
}

export default OwnerItemCard