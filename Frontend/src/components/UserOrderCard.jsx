import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Data coming from MyOrderCard

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate()
   const url = import.meta.env.VITE_SERVER_URL;
  const [selectdRatig, setSelectedrating] = useState({});
  console.log("data in user order card", data)

  const handleStar = (itemId, rating) => {
    console.log('star', rating, itemId);
    try {
      const item = axios.post(`${url}/api/item/rating`, { rating, itemId }, { withCredentials: true });
      console.log("item", item);
      setSelectedrating(prev => ({ ...prev, [itemId]: rating }));
    } catch (err) {
      console.log(err)

    }

  }
  return (
    <div className='flex flex-col bg-white p-4 shadow-lg space-y-4'>
      <div className='flex justify-between '>
        <div className='flex items-center'>
          <div>
            <h2 className='text-xl font-bold text-[#ff4d2d]'>Order ID: {data._id.slice(-6)}</h2>
            <p className='text-gray-500'>Date: {new Date(data.createdAt).toLocaleDateString()}</p>
          </div>

        </div>
        <div>
          <h2 className='text-lg font-bold text-[#ff4d2d]'>PaymentMode: <span className='text-gray-500 font-bold'>{data.paymentMethod.toUpperCase()}</span></h2>
          <p className='text-gray-500 text-lg font-bold'>Status: <span className='text-blue-500 font-bold'>{data.shopOrder[0].status}</span></p>
        </div>
      </div>

      {data.shopOrder.map((shoporder, index) => (
        <div
          key={index}
          className="border border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden mb-4"
        >
          {/* Shop Header */}
          <div className="bg-[#fff5f3] px-4 py-3 border-b border-gray-100">
            <h1 className="text-base font-bold text-[#ff4d2f] tracking-wide">
              🏪 {shoporder.shop.name}
            </h1>
          </div>

          {/* Items List */}
          <div className="divide-y divide-gray-100">
            {shoporder.shopOrderItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 sm:p-4"
              >
                {/* Image */}
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={item.item.image}
                    alt={item.item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {item.item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-sm font-bold text-gray-700 mt-0.5">
                    ₹{item.price}
                  </p>

                  {shoporder.status == "delivered" && <div className='flex space-x-1 mt-2'>
                    { [1, 2, 3, 4, 5].map((star) => (
                      <button onClick={()=>handleStar(item.item._id,star)}  
                      className={`text-xl ${selectdRatig[item.item._id] >= star?'text-yellow-400':'text-gray700'}`}>✰</button>
                    )) }
                  </div>

                  }
                </div>

                {/* Track Button — always at end */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => navigate(`/track-order/${data._id}`)}
                    className="bg-[#ff4d2f] hover:bg-[#e03d20] active:scale-95 transition-all text-white text-xs sm:text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl whitespace-nowrap shadow-sm"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export { UserOrderCard }