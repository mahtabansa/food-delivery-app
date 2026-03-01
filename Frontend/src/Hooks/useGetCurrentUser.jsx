import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUserData, clearUser } from "../Redux/userSlice.js";

function useGetCurrentUser() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false); // strict mode double call fix

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/user/current_user",
          { withCredentials: true }
        );

        dispatch(setUserData(data));
      } catch (err) {
        dispatch(clearUser()); // VERY IMPORTANT
        
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return loading;
}

export default useGetCurrentUser;