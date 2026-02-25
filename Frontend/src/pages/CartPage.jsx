import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartItemCard from '../components/CartItemCart.jsx';
import { TotalAmount } from '../Redux/userSlice.js';
const CartPage = () => {
       const { CardItems,TotalAmount } = useSelector(state => state.user);
       const navigate = useNavigate();
       console.log("card items",CardItems);
  return (
    <div className='min-h-screen bg-[#fff9f6] flex justify-center p-6'>
      <div className='w-full max-w-[800px]'>

            <div className='flex items-center gap-[20px] mb-6'>
                  <div className='z-10' onClick={()=>navigate(-1)}>
                        <IoArrowBack size={35} className='text-[#ff4d2d] cursor-pointer' />
                  </div>
                  <h1 className='text-2xl font-bold text-[#ff4d2d]'>Your Cart</h1>
             </div> 
               
                 {CardItems.length == 0 ? <div className='text-center text-gray-500 mt-10 text-3xl font-bold'>Your cart is empty</div> :
                  <> <div className='flex flex-col gap-4'>
                 
                  {CardItems.map(item=>(
                         <CartItemCard key={item.id} item={item}/>
                  ))}
                 </div> 

                 <div className='mt-6 p-4 bg-white rounded-lg shadow-md flex items-center justify-between'>
                  <h1 className='text-xl font-bold text-2xl'>Total Amount</h1>
                  <span className='ml-2 text-2xl'>₹{TotalAmount}</span>
                 </div>

                 <div className='flex justify-end m-4'> 
                  <button className='bg-[#ff4d2d] rounded-lg text-white px-6 py-2 hover:bg-[#ff2a00] cursor-pointer' onClick={()=>navigate('/check-out')}>Proceed to CheckOut</button>
                 </div>
                    </>
                  }
                

      </div>
     
      </div>      
      ) 
}    


export default CartPage

