import axios from 'axios'
import React,{ useEffect } from 'react'
import { useDispatch } from 'react-redux';      
import { setUserData } from '../Redux/userSlice.js';
function useGetCuurentUser() {
    const dispatch = useDispatch(); 
      useEffect(() => {
            const fetchUser = async () => {
                  try {
                       
                        const result = await axios.get(
                            'http://localhost:8000/api/user/current_user',
                              { withCredentials: true } 
                        )
                    
                        dispatch(setUserData(result.data));
                        
                  } catch(err) {
                        console.log('Error occured during get current user:', err);
                        
                  }
            }
            fetchUser();
      }, []) 
}

export default useGetCuurentUser;