import React, { useState } from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite, FaStar } from "react-icons/fa6";

import { GoStarFill } from "react-icons/go";

import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { AddToCardItems } from '../Redux/userSlice.js';


const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { CardItems } = useSelector((state) => state.user);

  const renderStar = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {

      stars.push(
        (i <= rating) ? <GoStarFill className='text-yellow-500 text-lg' /> : <FaStar className='text-yellow-500 text-lg' />
      )

    }
    return stars;
  }
  const isInCart = CardItems.some(i => i._id === data._id)
  const handleIncrease = () => {
    const newQnt = quantity + 1;
    setQuantity(newQnt);
  }

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQnt = quantity - 1;
      setQuantity(newQnt);
    }

  }
  return (
    <div className="group relative w-60 rounded-2xl overflow-hidden bg-white 
      border border-gray-100 shadow-md hover:shadow-xl 
      transition-all duration-300 hover:-translate-y-1 flex flex-col">

      {/* ── Image Block ── */}
      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
        <img
          src={data?.image}
          alt={data?.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = 'https://placehold.co/400x300?text=No+Image' }}
        />

        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Veg / Non-veg badge */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 
          rounded-full text-xs font-semibold shadow-sm
          ${data?.foodType === 'veg'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {data?.foodType === 'veg'
            ? <><FaLeaf size={10} /> Veg</>
            : <><FaDrumstickBite size={10} /> Non-veg</>
          }
        </div>

        {/* Rating pill on image */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 
          bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <FaStar size={10} className="text-amber-400" />
          <span className="text-xs font-bold text-gray-800">
            {data?.rating?.average?.toFixed(1) || '4.0'}
          </span>
          <span className="text-xs text-gray-400">
            ({data?.rating?.count || 0})
          </span>
        </div>
      </div>

      {/* ── Info Block ── */}
      <div className="flex flex-col gap-3 p-3">

        {/* Name */}
        <h2 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
          {data?.name}
        </h2>

        {/* Stars row */}
        <div className="flex items-center gap-0.5">
          {renderStar(data?.rating?.average)}
        </div>

        {/* Price + Controls */}
        <div className="flex items-center justify-between mt-auto">

          {/* Price */}
          <span className="text-base font-extrabold text-[#ff4d2d]">
            ₹{data?.price}
          </span>

          {/* Quantity + Cart */}
          <div className="flex items-center rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <button
              onClick={handleDecrease}
              className="px-2 py-1.5 hover:bg-gray-100 transition text-gray-600 active:scale-90"
            >
              <FaMinus size={10} />
            </button>

            <span className="px-2.5 text-xs font-bold text-gray-800 border-x border-gray-200">
              {quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="px-2 py-1.5 hover:bg-gray-100 transition text-gray-600 active:scale-90"
            >
              <FaPlus size={10} />
            </button>

            <button
              onClick={() => quantity > 0 && dispatch(AddToCardItems({ ...data, quantity }))}
              className={`px-2.5 py-1.5 transition-colors duration-200 active:scale-90
                ${isInCart
                  ? 'bg-gray-800 text-white'
                  : 'bg-[#ff4d2d] text-white hover:bg-[#e63d1f]'
                }`}
            >
              <FaCartShopping size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  )

}
export { FoodCard }