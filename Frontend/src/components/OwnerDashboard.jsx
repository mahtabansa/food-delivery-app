import { useSelector } from "react-redux";
import Navbar from "./Navbar.jsx";
import { setMyShopData } from '../Redux/ownerSlice.js'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
      const { myShopData } = useSelector((state) => state.owner);
      const navigate = useNavigate();
      return (
            <>
                  <Navbar />
                  {!myShopData && <div className="bg-white flex flex-col items-center">
                  
                        <div className="w-full max-w-md flex justify-center itmes-center items-center p-4 
                        sm:p-6 bg-white shadow-lg hover:shadow-2xl rounded-md transition-shadow duration-200">
                                <div className="flex flex-col justify-center items-center ">
                                    <FaUtensils className="text-[#ff4d2d] h-16 w-16 sm:h-20 sm:w-20 mb-4 "/>
                                    <h2 className="text-[#ff4d2d] text-xl sm:text-2xl font-bold text-gray-800 mb-2">Add Your Restaurant</h2>
                                    <span className="text-center font-semibold sm:px-4 lg:px-4  md:px-4 mb-4 text-gray-800 mb-2">
                                          join our food delivery platform and reach thousand of hungry customers everyday.  </span>
                                    
                                           <button className="bg-[#ff4d2d] text-white text-xl rounded-full font-medium px-5 py-1 hover:bg-orange-600 transition-colors duration-200"  
                                         onClick={()=>navigate("/create-edit-shop")}>Get Started</button>
                                    
                                   

                                </div>
                            


                        </div>
                  </div>
                  }
            </>
      )
}
export default OwnerDashboard;