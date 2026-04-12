import useGetCuurentUser from './Hooks/useGetCurrentUser.jsx';
import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home.jsx';
import UseGetCurrentCity from './Hooks/UseGetCurrentCity.jsx';
import useGetMyShop from './Hooks/useGetMyShop.jsx';
import CreateEditShop from './pages/CreateEditShop.jsx';
import AddItem from './pages/AddItem.jsx';
import EditItem from './pages/EditItem.jsx';
export const serverUrl = 'http://localhost:8000'
import UseGetShopByCity from './Hooks/UseGetShopByCity.jsx';
import UseGetItemsInCity from './Hooks/UseGetItemsInCity.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckOut from './pages/CheckOut.jsx';
import OrderPlaced from './pages/OrderPlaced.jsx';
import MyOrder from './components/MyOrder.jsx';
import UseGetMyOrders from './Hooks/UseGetMyOrder.jsx';
import { UseUpdateUserLocation } from './Hooks/UseUpdateUserLocation'
import TrackOrderPage from './pages/TrackOrderPage';
import Shop from './pages/Shop.jsx';
import { useEffect } from 'react';
import {socket} from './socket.js';


function App() {
  const dispatch = useDispatch();
  const  userData = useSelector((state) => state.user.userData);

  useGetCuurentUser();
  console.log("userData", userData);
  UseGetCurrentCity();
  useGetMyShop();
  UseGetShopByCity();
  UseGetItemsInCity();
  UseGetMyOrders();
  UseUpdateUserLocation();



   useEffect(() => {
  if (!socket || !userData?._id) return;

  const handleConnect = () => {
    socket.emit("identity", { userId: userData._id });
  };

  // Agar socket pehle se connected hai (refresh ke baad)
  if (socket.connected) {
    handleConnect();
  }

  // Event listener for connect
  socket.on("connect", handleConnect);

  return () => {
    socket.off("connect", handleConnect);
  };
}, [userData, socket]); // Dono par depend karein


//   useEffect(()=>{
//   socket.on("newOrder",(data)=>{
//     console.log("data  in the app.jsx",data)

//     if(data?.shoporder?.owner._id === userData?._id){
//     dispatch(setMyorder((prev)=>({
//    ...prev,
//    orders:[data,...prev.orders]
// })))
//     }
//   })

  // return ()=>{
  //   socket.off("newOrder")
  // }
// },[userData])


  return (
    <>
      <Routes>
        <Route path="/" element={userData ? <Home /> : <Navigate to='/signin' />} />
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />

        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />

        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to={'/signin'} />} />

        <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />} />

        <Route path='/add-item' element={userData ? <AddItem /> : <Navigate to={"/signin"} />} />

        <Route path='/edit-item/:itemId' element={userData ? <EditItem /> : <Navigate to={"/signin"} />} />

        <Route path='/get-by-id/:itemId' element={userData ? <EditItem /> : <Navigate to={"/signin"} />} />

        <Route path='/delete-item/:itemId' element={userData ? <Home /> : <Navigate to={"/signin"} />} />

        <Route path='/get-shop-by-city/:city' element={userData ? <Home /> : <Navigate to={"/signin"} />} />

        <Route path='/cart-page' element={userData ? <CartPage /> : <Navigate to={"/signin"} />} />

        <Route path='/check-out' element={userData ? <CheckOut /> : <Navigate to={"/signin"} />} />

        <Route path='/order-placed' element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />} />

        <Route path='/my-orders' element={userData ? <MyOrder /> : <Navigate to={"/signin"} />} />

        <Route path='/track-order/:orderId' element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />} />

        <Route path='/get-ByshopId/:shopId' element={userData ? <Shop /> : <Navigate to={"/signin"} />} />



      </Routes>


    </>
  )
}

export default App
