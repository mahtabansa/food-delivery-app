import Navbar from "./Navbar.jsx";
import { categories } from "../category.js";
import CategoryCard from "./CategoryCard.jsx";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard.jsx";
import { data } from "react-router-dom";

function UserDashboard() {
      const { currentCity,shopsInMyCity, ItemsInMyCity } = useSelector(state => state.user);

      const CateScrollRef = useRef();
      const shopScrollRef = useRef();
      const [showLeftCateButton, setShowLeftCateButton] = useState(false);
      const [showRightCateButton, setShowRightCateButton] = useState(false);
      const [showLeftShopButton, setShowLeftShopButton] = useState(false);
      const [showRightShopButton, setShowRightShopButton] = useState(false);


      const UpdateButton = (ref, setLeftButton, setRightButton) => {
            const element = ref.current;
            if (element) {
                  setLeftButton(element.scrollLeft > 0);
                  setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth);
            }
      }
      const ScrollHandler = (ref, direction) => {
            if (ref.current) {
                  ref.current.scrollBy({
                        left: direction == "left" ? -200 : 200,
                        behavior: "smooth"
                  })
            }
      }
      useEffect(() => {

            const cateEl = CateScrollRef.current;
            const shopEl = shopScrollRef.current;

            if (!cateEl || !shopEl) return;

            const handleCateScroll = () =>
                  UpdateButton(CateScrollRef, setShowLeftCateButton, setShowRightCateButton);

            const handleShopScroll = () =>
                  UpdateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);

            // attach
            cateEl.addEventListener("scroll", handleCateScroll);
            shopEl.addEventListener("scroll", handleShopScroll);

            // initial check
            handleCateScroll();
            handleShopScroll();

            // cleanup
            return () => {
                  cateEl.removeEventListener("scroll", handleCateScroll);
                  shopEl.removeEventListener("scroll", handleShopScroll);
            };

      }, []);   // 🚀 no dependency

      return (
            <>
                  <div className='w-screen min-h-screen overflow-x-hidden flex flex-col gap-5 items-center bg-[#fff9f6]'>
                        <Navbar />

                        <h1 className="text-gray-800 text-2xl sm:text-3xl">
                              inspiration for your first orders
                        </h1>
                        {/* food catergory */}
                        <div className="w-min-screen max-w-6xl relative">

                              {/* LEFT BUTTON */}
                              {showLeftCateButton &&
                                    <button
                                          className="absolute left-0 top-1/2 -translate-y-1/2 text-white bg-[#ff4d2d] 
                                          p-2 rounded-xl z-10 shadow-lg"
                                          onClick={() => ScrollHandler(CateScrollRef, "left")}
                                    >
                                          <FaChevronLeft />
                                    </button>}

                              {/* SCROLL CONTAINER */}
                              <div
                                    ref={CateScrollRef}
                                    className="overflow-x-auto scroll-smooth px-10"
                              >
                                    <div className="flex gap-4 pb-4">
                                          {categories.map((item) => (
                                                <CategoryCard name={item.category} image={item.image} key={item._id} />
                                          ))}
                                    </div>
                              </div>

                              {/* RIGHT BUTTON */}
                              {showRightCateButton &&
                                    <button
                                          className="absolute right-0 top-1/2 -translate-y-1/2 text-white bg-[#ff4d2d] 
                                    p-2 rounded-xl z-10 shadow-lg hover:bg-[#e64528]"
                                          onClick={() => ScrollHandler(CateScrollRef, "right")}
                                    >
                                          <FaChevronRight size={20} />
                                    </button>
                              }
                        </div>


                        <div className=" w-full max-w-6xl flex flex-col  gap-5 items-start ">
                              <h1 className="text-gray-800 text-2xl sm:text-3xl items-start py-2">
                                    Best Shop in {currentCity}
                              </h1>
                        </div>


                        {/* /* Current Shops in the City*/}
                        <div className="w-screen w-min-screen max-w-6xl relative  ">

                              {/* LEFT BUTTON */}
                              {showLeftShopButton &&
                                    <button
                                          className="absolute left-0 top-1/2 -translate-y-1/2 text-white bg-[#ff4d2d] 
                                          p-2 rounded-xl z-10 shadow-lg"
                                          onClick={() => ScrollHandler(shopScrollRef, "left")}
                                    >
                                          <FaChevronLeft />
                                    </button>}

                              {/* SCROLL CONTAINER */}
                              <div
                                    ref={shopScrollRef}
                                    className="overflow-x-auto scroll-smooth "
                              >
                                    <div className="flex ">
                                          {!shopsInMyCity ? <p>Loadding...</p> : shopsInMyCity?.map((shop) => (
                                                <CategoryCard name={shop.name} image={shop.image} key={shop._id} />
                                          ))
                                          }
                                    </div>
                              </div>

                              {/* RIGHT BUTTON */}
                              {showRightShopButton &&
                                    <button
                                          className="absolute right-0 top-1/2 -translate-y-1/2 text-white bg-[#ff4d2d] 
                                    p-2 rounded-xl z-10 shadow-lg hover:bg-[#e64528]"
                                          onClick={() => ScrollHandler(shopScrollRef, "right")}
                                    >
                                          <FaChevronRight size={20} />
                                    </button>
                              }
                        </div>

                      { <div className="w-screen w-min-screen max-w-6xl relative my-5 ">
                              
                                    <h1 className="text-gray-800 text-2xl sm:text-3xl items-start pb-5"> suggested Food items</h1>
                             
                              <div className="flex gap-5 ">{ ItemsInMyCity?.map((data)=>(
                                   < FoodCard data={data} key={data._id}/>
                              ))} </div>

                        </div>
                        }


                  </div>

            </>
      )
}
export default UserDashboard;