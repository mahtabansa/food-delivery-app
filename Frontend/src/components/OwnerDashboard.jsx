import { useSelector } from "react-redux";
import Navbar from "./Navbar.jsx";
import { setMyShopData } from '../Redux/ownerSlice.js'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import OwnerItemCard from '../components/OwnerItemCard.jsx'
function OwnerDashboard() {
      const { myShopData } = useSelector((state) => state.owner);

      const navigate = useNavigate();
      return (
            <>
                  <Navbar />
                  <div className="flex flex-col">

                        {!myShopData && <div className="w-full max-w-md flex justify-center itmes-center items-center p-4 
                                    sm:p-6 bg-white shadow-lg hover:shadow-2xl rounded-md transition-shadow duration-200">
                              <div className="flex flex-col justify-center items-center ">
                                    <FaUtensils className="text-[#ff4d2d] h-16 w-16 sm:h-20 sm:w-20 mb-4 " />
                                    <h2 className="text-[#ff4d2d] text-xl sm:text-2xl font-bold text-gray-800 mb-2">Add Your Restaurant</h2>
                                    <span className="text-center font-semibold sm:px-4 lg:px-4  md:px-4 mb-4 text-gray-800 mb-2">
                                          join our food delivery platform and reach thousand of hungry customers everyday.  </span>

                                    <button className="bg-[#ff4d2d] text-white text-xl rounded-full font-medium px-5 py-1 
                                                      hover:bg-orange-600 transition-colors duration-200"
                                          onClick={() => navigate("/create-edit-shop")}>Get Started
                                    </button>

                              </div>
                        </div>
                        }

                        {myShopData && <div className="w-full max-w-md flex justify-center itmes-center items-center  
                                     shadow-lg hover:shadow-2xl rounded-md transition-shadow duration-200 px-1">
                              <div className="flex flex-col justify-center ">

                                    <h1 className="flex flex-row  justify-center text-center text-gray-900
                                    font-medium text-xl sm:text-2xl md:gap-3 mt-3"> <FaUtensils className="text-[#ff4d2d] h-12 
                                    w-12 sm:h-12 sm:w-12 mb-2 text-center " />wellcome to {myShopData?.name}</h1>

                                            
                                    <div className="flex justify-center max-w-4xl min-h-md object-cover text-center relative" >
                                          <div className="absolute top-[4px] right-[4px] bg-orange-500 p-2 rounded-full "><MdOutlineEdit 
                                           className="text-white text-2xl"  onClick={()=>navigate("/create-edit-shop")}/></div>
                                          <img src={myShopData?.image} alt=" Restaurant Image" className="  
                                           shadow-lg hover:shadow-2xl rounded-md transition-shadow duration-200
                                          w-full  object-cover rounded-md flex justify-center " />

                                    </div>
                                    <div className="flex flex-col justify-start px-1 gap-1 my-3">
                                                <h1 className="text-gray-800 font-semibold  ">Name, {myShopData?.name} </h1>
                                                <p className="text-gray-700"><span>State, {myShopData?.state}</span><span className="px-1">
                                                      City {myShopData?.city}</span></p>
                                                <p className="text-gray-700 "> Address,{myShopData?.address}</p>

                                                
                                    </div>
                              </div>
                        </div>
                        }

                         {myShopData?.items?.length==0 && <div className="max-w-md flex justify-center itmes-center items-center mt-4 
                                    sm:p-6  shadow-lg hover:shadow-2xl rounded-md transition-shadow duration-200">
                              <div className="flex flex-col justify-center items-center mt-4   ">
                                    <FaUtensils className="text-[#ff4d2d] h-12 w-12 sm:h-14 sm:w-14 mb-4 text-center" />
                                    <h2 className="text-[#ff4d2d] text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center">
                                          Add Food Items</h2>
                                    <span className="text-center font-semibold text-gray-800 mb-2 text-center">
                                          Share your delicious creations with our customers by adding them to the menu  </span>

                                    <button className="bg-[#ff4d2d] text-white text-xl rounded-full font-medium px-5 py-1 
                                                      hover:bg-orange-600 transition-colors duration-200"
                                          onClick={() => navigate("/add-item")}>Add Food
                                    </button>

                              </div>
                        </div>
                        }

                        {myShopData?.items?.length > 0 &&
                        
                        <>
                              {myShopData.items.map((data,key)=>(
                                          <OwnerItemCard data={data} key={key}/>
                              ))}
                              
                        </>
                               
                        
                        
                        }

                  </div>


            </>
      )
}
export default OwnerDashboard;