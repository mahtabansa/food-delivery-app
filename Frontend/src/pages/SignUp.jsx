import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import { ClipLoader } from 'react-spinners'
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/userSlice.js";

export default function SignUp() {
  const primaryColor = "#ff4d2d";
  const hoverColro = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#e6b054ff";
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate=useNavigate();
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [mobile,setMobile] = useState("");
  const [error,setError]=useState("");
  const [loader ,setloader]=useState(false);

  const dispatch = useDispatch();

const handleSignUp = async (event) => {
  console.log("handle signup event",event.target.value);
  setloader(true);
  event.preventDefault();
    // Add validation before sending
  if (!fullName || !email || !password || !mobile) {
    setError("All fields are required");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  if (mobile.length !== 10) {
    setError("Phone number must be 10 digits");
    return;
  }

try {
    const response = await axios.post(
      'http://localhost:8000/api/auth/signup',
      { fullName, email, password, mobile, role },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );
   dispatch(setUserData(response.data));
     console.log('Success:', response.data);
    setError("");
    setloader(false);
    navigate("/");
    
  } catch (error) {
    console.error('Full error:', error);
    setloader(false);
    
    if (error.response) {
      const errorMessage = error.response.data.message || 
                          error.response.data || 
                          "Something went wrong";
      setError(errorMessage);
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      // No response from server
      setError("Cannot connect to server. Please check if backend is running.");
      console.error('No response:', error.request);
    } else {
      // Other errors
      setError(error.message || "An error occurred");
      console.error('Error:', error.message);
    }
  }
};

const handlewithGoogle = async () => {
  if(!mobile){
    return alert("mobile number is required");
  }
  const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log("Google auth successful:", result.user);
    console.log(result.user.email);
  try{  
       let {data} = await axios.post('http://localhost:8000/api/auth/google-auth',
        {
         fullName:result.user.displayName,email:result.user.email,
         mobile,role
       },{withCredentials:true})
       dispatch(setUserData(data));
       setError("");
      console.log(data);
  } catch (error) {
    setError(error.response.data.message);
    console.error(error);
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}>
      <div className={`bg-white rounded-lg w-full max-w-md p-8 border-[1px] border-${borderColor}`}>
        <h1 className="font-bold text-2xl" style={{ color: primaryColor }}>vingo</h1>
        <p className="text-gray-600"> Create your accont to get started with delicious food deliveries</p>

        {/* full name*/}
        <div className="mt-4">
          <label htmlFor="fullName" className='block text-gray-700 font-medium mb-1 '>Full Name</label>

          <input type="text" placeholder="Enter your full Name"
            className="w-full border rounded-lg px-3 py-2 border-1 border-orange-900"
            style={{ border: `1px solid ${borderColor}` }} onChange={(evnt)=>setFullName(evnt.target.value)}
            value={fullName} required/>
        </div>

        {/*email*/}
        <div className="mt-4">
          <label htmlFor="email" className='block text-gray-700 font-medium mb-1 '>Email</label>
          <input type="email" placeholder="Enter your @email"
            className="w-full border rounded-lg px-3 py-2 border-1 border-orange-900"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(evnt)=>setEmail(evnt.target.value)}  value={email} required/>
        </div>

        {/*mobile*/}
        <div className="mt-4">
          <label htmlFor="mobile" className='block text-gray-700 font-medium mb-1 '>Mobile</label>
          <input type="text" placeholder="Enter your mobile number"
            className="w-full border rounded-lg px-3 py-2 border-1 border-orange-900"
            style={{ border: `1px solid ${borderColor}` }} 
            onChange={(e)=>setMobile(e.target.value)} value={mobile} required/>
        </div>

        {/*password*/}
        <div className="mt-4">
          <label htmlFor="password" className='block text-gray-700 font-medium mb-1 '>Password</label>
          <div className='relative'>
            <input type={`${showPassword ? "text" : "password"}`} placeholder="Enter your password "
              className="w-full border rounded-lg px-3 py-2 border-1 border-orange-900"
              style={{ border: `1px solid ${borderColor}` }}
               onChange={(e)=>setPassword(e.target.value)}
               value={password}  />

            <button className="absolute right-5 top-2.5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(prev => !prev)} >
              {!showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div >
        {/* role */}

        <div className="mt-4">

          <div className="flex justify-evenly ">
            {["user", "owner", "deliveryBoy"].map((r,i) => (
              <button key={i} className="border-1 border-orange-400 p-3 w-25 rounded-lg" 
              onClick={() => setRole(r)} 
              style={role == r ? { backgroundColor: primaryColor, color: "white" } 
              : { border: `1px solid ${primaryColor}`, color: "#333" }}>{r}</button>
            ))}
          </div>
        </div>

       {/* signUp Button */}
       <button className="w-full bg-[#ff4d2d]  py-2  mt-5 border rounded-lg text-white hover:bg-[#e64323] cursor-pointer" 
       onClick={handleSignUp} disabled={loader}>{loader?<ClipLoader size={20}/>:"SignUp"}</button>
        {error && <p className="text-[#ff4d2d] py-3 " >*{error}</p>}

       <button className="flex items-center justify-center gap-3 w-full 
      border border-gray-400 mt-2 p-2
       rounded-lg transition duration-gray-400 hover:bg-gray-100" onClick={handlewithGoogle}>
        <FcGoogle size={20} />
        <span className="text-lg" >sign up with Google</span>
        </button>
        <button className="mt-4 w-full cursor-pointer ">
          <p onClick={()=>navigate("/signin")}>Already have an accont ?
            <span className="mt-4" 
            style={{color:primaryColor}}>
            SignIn</span></p>
        </button>
      </div>
    </div >

  );
}  
   
