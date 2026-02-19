import useGetCuurentUser from './Hooks/useGetCurrentUser.jsx';
import { useSelector } from 'react-redux';
import './App.css'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx';
import UseGetCurrentCity from './Hooks/UseGetCurrentCity.jsx';
import useGetMyShop from './Hooks/useGetMyShop.jsx';
import CreateEditShop from './pages/CreateEditShop.jsx';
import AddItem from './pages/AddItem.jsx';
import EditItem from './pages/EditItem.jsx';
export const serverUrl= 'http://localhost:8000'
import UseGetShopByCity from './Hooks/UseGetShopByCity.jsx';
import UseGetItemsInCity from './Hooks/UseGetItemsInCity.jsx';



function App() {
  const userData = useSelector((state) => state.user.userData);
  useGetCuurentUser();
  UseGetCurrentCity();
  useGetMyShop();
  UseGetShopByCity();
  UseGetItemsInCity();
  

  return (
    <>
      <Routes>
         <Route path="/" element={userData ? <Home /> : <Navigate to='/signin' />} />
       <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />

        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />

        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to={'/signin'} />} />

        <Route path='/create-edit-shop' element={userData? <CreateEditShop/>:<Navigate to={"/signin"}/> }/>

        <Route path='/add-item' element={userData? <AddItem/>:<Navigate to={"/signin"}/>}/>

        <Route path='/edit-item/:itemId' element={userData? <EditItem/>:<Navigate to={"/signin"}/>}/>
        
         <Route path='/get-by-id/:itemId' element={userData? <EditItem/>:<Navigate to={"/signin"}/>}/>

          <Route path='/delete-item/:itemId' element={userData? <Home/>:<Navigate to={"/signin"}/>}/>

           <Route path='/get-shop-by-city/:city' element={userData? <Home/>:<Navigate to={"/signin"}/>}/>
       
      </Routes>


    </>
  )
}

export default App
