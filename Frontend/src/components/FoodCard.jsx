import React, { useState } from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa6";
import { GoStarFill } from "react-icons/go";
import { FiStar } from "react-icons/fi";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = useState(0);

  const renderStar = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {

      stars.push(
        (i <= rating) ? <GoStarFill className='text-yellow-500 text-lg' /> : <FiStar className='text-yellow-500 text-lg' />
      )

    }
    return stars;
  }
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
    <div className='min-w-[150px] h-[10px] bg-blue-500  md:w-[200px] md:h-[200px] border-2 rounded-2xl  border-[#ff4d2d] 
        shrink-0 overlfow-hidden bg-white shadow-xl shadow-gray-200 hover:shandow-lg transition-shadow transform  transition-transform flex justify-center relative hover:scale-110'>
      <div className=''>
        <div className='absolute top-1 right-1 text-2xl p-2 bg-orange-200 rounded-full'>
          {data.foodType == "veg" ? <FaLeaf className='text-green-800' /> : <FaDrumstickBite className='text-[#E74C3C]' />
          }
        </div>

        <img src={data.image} alt='item image' className='h-full w-full object-cover  
         rounded-xl ' />

        <div className='flex flex-1 flex-col  px-3  w-full absolute left-0 bottom-0 bg-opacity-95 bg-[#ffffff96] rounded-b-xl text-small 
          text-center text-sm text-gray-800 font-bold  backdrop-blur z-9999 '>
          <h1 className='font-bold'>{data.name}</h1>

          <div className='flex items-center gap-1 mt-1 m-2'>
            {renderStar(data.rating?.average || 1)}
            <span className='px-3'>{data.rating?.count || 0}
            </span>
          </div>


          <div className='flex items-center justify-between aligns-center pb-2'>
            <div>       {data.price}</div>

            <div className='bg-white text-black rounded-2xl gap-4 px-3 overflow-hidden shadow-sm  border'>
              <button className='px-1 py-1 hover:bg-gray-100 transition' onClick={()=>handleDecrease()}>
                <FaMinus size={12} />
              </button>

              <button className='px-1 py-1 hover:bg-gray-100 transition'>
                {quantity}
              </button>

              <button className='px-1 py-1 hover:bg-gray-400  transition'>
                <FaPlus size={12}  onClick={()=>handleIncrease()}/>
              </button>

              <button className='px-2 bg-[#ff4d2d] transition rounded-md p-2'>
                <FaCartShopping className="text-white " size={20} />
              </button>

            </div>

          </div>


        </div>





      </div>



    </div>
  )
}

export default FoodCard