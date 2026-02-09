import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentCity, setCurrentState,setCurrentAddress } from '../Redux/userSlice.js';
function UseGetCurrentCity() {
      const dispatch = useDispatch();
      const  userData = useSelector(state => state.user);
      
      const apikey = import.meta.env.VITE_GEOCODING_APIKEY;

      useEffect(() => {
            navigator.geolocation.getCurrentPosition(async (postion) => {
                  const lat = postion.coords.latitude;
                  const long = postion.coords.longitude;

                  const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&type=postcode&format=json&apiKey=${apikey}`);
                  const result = response.data.results[0].address_line1 || response.data.results[0].city;
                        
                       
                  dispatch(setCurrentAddress(response.data.results[0].county ))
                  dispatch(setCurrentState(response.data.results[0].state))
                  dispatch(setCurrentCity(result));

                  

            })

      }, [userData])

}

export default UseGetCurrentCity;