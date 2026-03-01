import React from 'react'
// Data coming from MyOrderCard
const UserOrderCard = ({ data }) => {
  console.log("data in user order card", data)
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

      {
        data.shopOrder.map((shoporder, index) => (
          <div key={index} className=' border bg-gray-100 p-2 shadow-md rounded-lg space-y-2'>

           <h1 className='text-lg font-bold text-gray-600'>Owner: {shoporder.shop.name}</h1>
            <div className='flex space-x-4 overflow-x-auto pb-2'>
              {shoporder.shopOrderItems.map((item, index) => (
                <div className='flex flex-start'>
                  <div key={index} className=' flex-shrink-0 w-30 h-30 rounded-lg p-2 bg-white gap-2'>
                    <img src={item.item.image} alt={item.item.name} className='w-full h-full rounded-md object-cover' />
                  </div>

                  <div className='gap-5 p-4'>
                    <h3 className='text-md font-bold text-gray-600 pb-1'>{item.item.name}</h3>
                    <p className='text-gray-500 pb-1'>Quantity: {item.quantity}</p>
                    <p className='text-gray-500'>Price: ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

           

          </div>


        ))
      }
    </div>
  )
}

export { UserOrderCard }