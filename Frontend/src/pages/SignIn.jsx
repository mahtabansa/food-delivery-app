import { useDispatch } from "react-redux";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { use, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import {GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
import {auth,app} from '../../firebase'
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../Redux/userSlice.js";


export default function SignIn() {
  const primaryColor = "#ff4d2d";
  const hoverColro = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#e6b054ff";
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loader ,setloader ]=useState(false);
  const dispatch = useDispatch(); 

  const handleSignIn = async (event) => {

   if(!email || !password){
    setError("password and email required");
    return;
   }
  try {
     setloader(true);
     
    const response = await axios.post(`${serverUrl}/api/auth/signin`, 
      {email,password},{withCredentials:true})
      
      if(response.data){
        console.log("response.data",response.data);
        dispatch(setUserData(response.data));
        navigate("/");
      }
    
      console.log("handle signIn",response.data); 
       return setloader(false);
       

  } catch(err){
   
    setloader(false);
    setError( err.response?.data || "SignIn failed. Please try again.");
     return console.error("SignIn error:", err) ;
 }
  }

const handlewithGoogle = async () => {
   
  const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
      console.log("google auth result",result);
  
  try{  
       let {data} = await axios.post(`${serverUrl}/api/auth/google-auth`,
        {
         email:result.user.email,
         
       },{withCredentials:true},
     
)
dispatch(setUserData(data));
navigate("/");
  } catch (error) {
    console.log( error);
  }
};
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}>
      <div className={`bg-white rounded-lg w-full max-w-md p-8 border-[1px] border-${borderColor}`}>
        <h1 className="font-bold text-2xl" style={{ color: primaryColor }}>vingo</h1>
        <p className="text-gray-600"> Create your accont to get started with delicious food deliveries</p>

        {/*email*/}
        <div className="mt-4">
          <label htmlFor="email" className='block text-gray-700 font-medium mb-1 '>Email</label>
          <input type="email" placeholder="Enter your @email"
            className="w-full border rounded-lg px-3 py-2 border-1 border-orange-900"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(evnt)=>setEmail(evnt.target.value)}  value={email} required/>
        </div>

        {/*password*/}
        <div className="mt-4">
          <label htmlFor="password" className='block text-gray-700 font-medium mb-1 '>Password</label>
          <div className='relative'>
            <input type={`${showPassword ? "text" : "password"}`} placeholder="Enter your password "
              className="w-full border rounded-lg px-3 py-2 border-1 border-orange-900"
              style={{ border: `1px solid ${borderColor}` }}
               onChange={(e)=>setPassword(e.target.value)}
               value={password} required/>

            <button className="absolute right-5 top-2.5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(prev => !prev)} >
              {!showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          <div className="text-right pt-1" style={{color:"#ff4d2d"}} onClick={()=>navigate("/forgot-password")} >forgot password</div>
        </div >

       {/* signIn Button */}
       <div className="w-full">
       <button className="w-full bg-[#ff4d2d]  py-2 mt-2 mb-2 border
        rounded-lg text-white hover:bg-[#e64323] cursor-pointer" 
        onClick={handleSignIn} disabled={loader}>{loader?<ClipLoader size={20}/>:"signIn"}</button>
         { error && <p className="text-[#ff4d2d] mb-2">*{error}</p>}
        </div>

       <button className="flex items-center justify-center gap-3 w-full 
      border border-gray-400  py-1.5 
       rounded-lg transition duration-gray-400 hover:bg-gray-100" onClick={handlewithGoogle}>
        <FcGoogle size={20} />
        <span className="text-lg" >sign In with Google</span>
        </button>
        <button className="mt-4 w-full cursor-pointer ">
          <p onClick={()=>navigate("/signup")}>want to create new accont ?
            <span className="mt-4" 
            style={{color:primaryColor}}>
            SignUp</span></p>
        </button>
      </div>
    </div >

  );
}

