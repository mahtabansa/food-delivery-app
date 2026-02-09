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
export const serverUrl= 'http://localhost:8000'

function App() {
  const userData = useSelector((state) => state.user.userData);
  useGetCuurentUser();
  UseGetCurrentCity();
  useGetMyShop();

  return (
    <>
      <Routes>
         <Route path="/" element={userData ? <Home /> : <Navigate to='/signin' />} />
       <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />

        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />

        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to={'/signin'} />} />

        <Route path='/create-edit-shop' element={userData? <CreateEditShop/>:<Navigate to={"/signin"}/> }/>
       
      </Routes>


    </>
  )
}

export default App
