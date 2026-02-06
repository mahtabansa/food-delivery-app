import axios from "axios"
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../Redux/userSlice";
export default function ForgotPassword() {
      let [step, setstep] = useState(1);
      const [email, setEmail] = useState("");
      const [otp, setOtp] = useState("");
      const [newPassword, setNewPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [error, setError] = useState("");
      let navigate = useNavigate();

      const handlesendOtp = async (event) => {
            if (!email) {
                  setError("email is required");
                  return;
            }
            try {
                  const response = await axios.post(
                        'http://localhost:8000/api/auth/send-otp',
                        { email },
                        {
                              withCredentials: true,
                              headers: {
                                    'Content-Type': 'application/json'
                              }
                        }
                  );
                  console.log(response);
                  setError("");
                  setstep(2);
            } catch (err) {
                  setError(err.response.data.message);
                  console.error("Error:", err.response?.data || err.message);
            }
      }

      let handleverifyOtp = async () => {
            if (!otp) {
                  setError("Please provide otp ");
            }
            try {
                  const result = await axios.post('http://localhost:8000/api/auth/verify-otp', { email, otp },
                        {
                              withCredentials: true,
                              headers: {
                                    'Content-Type': 'application/json'
                              }
                        })
                  setError("");
                  setstep(3)
            } catch (err) {
                  setError(err.response.data.message);
            }
      }
      let handleResetOtp = async (event) => {
            if (!newPassword || !confirmPassword) {
                  setError("new password is required")
            }
            console.log(event);
            if (newPassword !== confirmPassword) {
                  return res.json({message:"passwords do not match"});

            }
            try {
                  const result = await axios.post('http://localhost:8000/api/auth/reset-password', { email, newPassword },
                        {
                              withCredentials: true,
                              headers: {
                                    'Content-Type': 'application/json'
                              }
                        })
                  console.log(result);
                  setError("");
                  navigate("/signin");

            } catch (err) {
                  setError(err.response.data.message);
            }
      }
      return (
            <div className="bg-[#fff9f6] min-h-screen w-full flex items-center justify-center ">
                  <div className="bg-white w-full max-w-md p-8 shadow-lg rounded-lg">
                        <div className="bg-white flex items-center gap-4 justify-center ">
                              <IoMdArrowBack className="text-2xl " style={{ color: "#ff4d2d" }}
                                    onClick={() => navigate("/signup")} />
                              <h1 className="font-bold text-2xl" style=
                                    {{ color: "#ff4d2d" }}>Forgot Password
                              </h1>
                        </div>
                        {step == 1 &&

                              <div className="mt-4">
                                    <input type="email" placeholder="Enter your Email"
                                          className="w-full border rounded-lg px-3 py-2 border-gray-400 "
                                          value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <button className=" mt-3 py-2 w-full bg-[#ff4d2d] border rounded-lg"
                                          onClick={handlesendOtp}>SendOTP</button>
                                    {error && <p className="text-[#ff4d2d] text-center py-3" >*{error}</p>}
                              </div>
                        }
                        {step == 2 &&

                              <div className="mt-4">
                                    <input type="text" placeholder="Enter OTP"
                                          className="w-full border rounded-lg px-3 py-2 border-gray-400" value={otp}
                                          onChange={(e) => setOtp(e.target.value)} required />
                                    <button className=" mt-3 py-2 w-full bg-[#ff4d2d] border rounded-lg text-white"
                                          onClick={handleverifyOtp}>Verify</button>
                                    {error && <p className="text-[#ff4d2d] py-3 text-center">*{error}</p>}
                              </div>
                        }

                        {step == 3 &&

                              <div className="mt-4 p-2 ">
                                    <label htmlFor="newpassword">New Password</label>
                                    <input type="password" placeholder="Enter New Password"
                                          className="w-full border rounded-lg px-3 py-2 border-gray-400 mb-5 mt-2"
                                          onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required />

                                    <label htmlFor="newPassword">Confirm Password</label>
                                    <input type="password" placeholder="Confirm Password"
                                          className="w-full border rounded-lg px-3 py-2 border-gray-400 mt-2"
                                          onChange={(e) => setConfirmPassword(e.target.value)}
                                          value={confirmPassword} required />

                                    <button className=" mt-3 py-2 w-full bg-[#ff4d2d] border rounded-lg"
                                          onClick={handleResetOtp}>Reset Password</button>
                                    {error && <p className="text-[#ff4d2d] py-3 text-center">*{error}</p>}
                              </div>
                        }
                  </div>

            </div>
      )
}
