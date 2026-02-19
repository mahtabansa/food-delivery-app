import React from 'react'

const CategoryCard = ({ name, image}) => {
  return (
    <div className='min-w-[120px] h-[100px] bg-blue-500  md:w-[180px] md:h-[180px] border-2 rounded-2xl  border-[#ff4d2d] 
        shrink-0 overlfow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow relative flex justify-center items-center'>
      <img src={image} alt='item image' className='w-full h-full object-cover transform hover:scale-110 transition-transform  border-[#ff4d2d]
         rounded-xl ' />
      <div className='w-full absolute left-0 bottom-0 bg-opacity-95 bg-[#ffffff96] rounded-2xl text-small border-[#ff4d2d]
          text-center text-sm text-gray-800 font-bold  backdrop-blur'>
        {name}
      </div>


    </div>
  )
}

export default CategoryCard