import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { updateQuantity } from '../Redux/userSlice.js'; 
import { removeItemFromCard } from '../Redux/userSlice.js';    
function CartItemCard({ item }) {
      const dispatch = useDispatch();     

      const handleIncrease = ({id, currentQuantity}) => {     
            dispatch(updateQuantity({ id: id, quantity: currentQuantity + 1 }));      
            
      }

      const handleDecrease = ({id, currentQuantity}) => {      
            if(currentQuantity > 1){
                   dispatch(updateQuantity({ id: id, quantity:currentQuantity - 1 }));      
            }
           
      }
  return (
    <div className='flex items-center gap-4 p-4 bg-white rounded-lg shadow-md'> 
      <img src={item.image} alt={item.name} className='w-20 h-20 object-cover rounded-md' />
      <div className='flex-1'>
        <h2 className='font-semibold'>{item.name}</h2>
        <p className='text-gray-500'>₹{item.price} X {item.quantity}</p>
        <p className='text-gray-500'>Total : ₹{item.price * item.quantity}</p>
      </div>

      <div  className='flex items-center gap-2'>
        <button className='bg-gray-200 text-gray-700 px-2 rounded-md text-2xl' onClick={()=>handleDecrease({id:item._id, currentQuantity:item.quantity})}><FaMinus size={15}/></button>
        <span className='text-gray-700'>{item.quantity}</span>
        <button className='bg-gray-200 text-gray-700 px-2  rounded-md text-2xl' onClick={()=>handleIncrease({id:item._id, currentQuantity:item.quantity})}><FaPlus size={15}/></button>

        <button className='bg-red-500 text-white px-3 py-1 rounded-md text-sm' onClick={()=>dispatch(removeItemFromCard(item._id))}><FaRegTrashCan size={15}/></button>
      </div>
    </div>
  )
}

export default CartItemCard