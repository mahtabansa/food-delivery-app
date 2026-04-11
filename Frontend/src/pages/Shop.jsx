import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { BsShop } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";

import { FoodCard } from '../components/FoodCard';

const Shop = () => {
      const [itemsInMyshop, setItemsInMyshop] = useState([]);
      const [shop, setShop] = useState([]);
      const { shopId } = useParams();
       const url = import.meta.env.VITE_SERVER_URL;


      const handleGetItems = async () => {
            try {
                  const result = await axios.get(`${url}/api/item/get-items-by-ShopId/${shopId}`, { withCredentials: true });
                  console.log("Items", result)
                  setItemsInMyshop(result?.data.items)
                  setShop(result.data.shop)
            } catch (err) {

                  console.log("error occurred while get shop By city", err);
            }
      }
      useEffect(() => {
            handleGetItems()
      }, [shopId])

      return (
            <div className='min-h-screen bg-gray-50'>
                  {shop && <div className='w-full relative h-64 md:h-70 lg:h-80 '>
                        <img src={shop.image} alt="shop image" className='w-full h-full object-cover' />
                        <div className='absolute mt-10 flex flex-col justify-center items-center text-center px-4  inset-0 '>
                              <BsShop className=' text-2xl font-extrabold text-[#ff4d2d] drop-shadow-lg' />
                              <h1 className='text-3xl md:text-5xl font-extrabold text-[#ff4d2d] drop-shadow-lg'>{shop.name}</h1>
                              <div className='flex items-center justify-center gap-[10px]'>
                                    <span className='font-bold'> <CiLocationOn className='text-[#ff4d2d] text-2xl ' /></span>

                                    <p className='text-lg text-gray-300 mt-[10px] text-center font-bold'>ADDRESS ,<span>{shop.address}</span></p>
                              </div>

                        </div>

                  </div>}


                  {itemsInMyshop && (
                        <>
                              {/* Header */}
                              <div className="text-center mb-10">
                                    <h1
                                          className="playfair orange-text-gradient font-extrabold tracking-tight leading-tight"
                                          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
                                    >
                                          Our Menu
                                    </h1>
                                    <p className="dm-sans text-gray-400 mt-2.5 text-sm font-light tracking-wide">
                                          Fresh ingredients · Crafted with love · Delivered fast
                                    </p>
                              </div>

                              <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                                    {itemsInMyshop.map((item) => (
                                          <FoodCard key={item._id} data={item} />
                                    ))}
                              </div>
                        </>
                  )}
            </div>
      )
}

export default Shop