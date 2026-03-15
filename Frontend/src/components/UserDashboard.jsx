import Navbar from "./Navbar.jsx";
import { categories } from "../category.js";
import CategoryCard from "./CategoryCard.jsx";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {FoodCard} from "./FoodCard.jsx";
import { useNavigate } from "react-router-dom";


function UserDashboard() {
      const { currentCity, shopsInMyCity, ItemsInMyCity ,SearchItem} = useSelector(state => state.user);
      console.log("SearchItem",SearchItem)
      const shop = shopsInMyCity?.[0]
      const CateScrollRef = useRef();
      const shopScrollRef = useRef();
      const [showLeftCateButton, setShowLeftCateButton] = useState(false);
      const [showRightCateButton, setShowRightCateButton] = useState(false);
      const [showLeftShopButton, setShowLeftShopButton] = useState(false);
      const [showRightShopButton, setShowRightShopButton] = useState(false);
      const [updateditems, setupdateditems] = useState([]);
      const Navigate = useNavigate();



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

      const handleClickitem = async (category) => {

            if (category === "Others") {
                  setupdateditems(ItemsInMyCity)
            }
            if (!ItemsInMyCity) return;

            const filterItem = ItemsInMyCity.filter((i) => i.category === category)
            setupdateditems(filterItem)
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
            setupdateditems(ItemsInMyCity)
            // cleanup
            return () => {
                  cateEl.removeEventListener("scroll", handleCateScroll);
                  shopEl.removeEventListener("scroll", handleShopScroll);
            };

      }, [ItemsInMyCity]);

      return (
            <>
                  <div className='w-screen min-h-screen overflow-x-hidden flex flex-col gap-5 items-center bg-[#fff9f6]'>
                        <Navbar />
                              { SearchItem && (<div
                              className="w-full max-w-6xl flex flex-col flex-start justify-center p-5  bg-[#fff9f6] rounded-2xl mt-4  ">

                                    <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold-b border-gray-200 pb-2  text-center pb-4">Your search results </h1>

                                    <div className="w-full h-auto flex flex-wrap gap-6 justify-center"> {SearchItem?.map((item)=>(
                                          <FoodCard  data={item} key={item._id} />
                                    ))}

                                    </div>
                                    </div>)
                                    }




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
                                                <CategoryCard name={item.category} image={item.image} key={item._id} onClick={() => handleClickitem(item.category)} />
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
                                    <div className="flex gap-5 ">
                                          {!shop ? <p>Loadding...</p> : shop?.map((shop) => (
                                                <CategoryCard name={shop?.name} image={shop?.image} key={shop._id} onClick={() => Navigate(`/get-ByshopId/${shop._id}`)} />
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

                        <div className="w-full max-w-6xl mx-auto px-4 my-5">

                              <h1 className="text-gray-800 text-2xl sm:text-3xl font-semibold pb-5">
                                    Suggested Food Items
                              </h1>

                              {/* Scrollable row on mobile, wrapping grid on larger screens */}
                              <div className="
                                          flex gap-4
                                          overflow-x-auto pb-3
                                          sm:flex-wrap sm:overflow-visible
                                          scrollbar-hide
                                                ">
                                    {updateditems?.map((data, id) => (
                                          <div key={id} className="shrink-0 sm:shrink w-[150px] sm:w-auto">
                                                <FoodCard data={data} />
                                          </div>
                                    ))}
                              </div>

                        </div>


                  </div>

            </>
      )
}
export default UserDashboard;