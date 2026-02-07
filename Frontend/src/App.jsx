import useGetCuurentUser from './Hooks/useGetCurrentUser.jsx';
import { useSelector } from 'react-redux';
import './App.css'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from './components/Navbar.jsx'
export const serverUrl = 'http://localhost:8000'

import Home from './pages/Home.jsx';
import UseGetCurrentCity from './Hooks/UseGetCurrentCity.jsx';


function App() {
  const userData = useSelector((state) => state.user.userData);
  useGetCuurentUser();
  UseGetCurrentCity();

  return (
    <>
      <Routes>
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to={'/signup'} />} />
        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to={'/signin'} />} />
        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to={'/signin'} />} />
        <Route path="/" element={userData ? <Home /> : <Navigate to={'/'} />} />
      </Routes>


    </>
  )
}

export default App
