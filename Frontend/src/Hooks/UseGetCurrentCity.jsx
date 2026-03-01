import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentCity, setCurrentState,setCurrentAddress } from '../Redux/userSlice.js';

import { setLocation,setAddress } from '../Redux/mapSlice.js';    

function UseGetCurrentCity() {
       const apikey = import.meta.env.VITE_GEOCODING_APIKEY;
      const  {userData} = useSelector(state => state.user);
        const dispatch = useDispatch();
     

      useEffect(() => {
            if(!userData) return ;
            navigator.geolocation.getCurrentPosition(async (postion) => {
                  const lat = postion.coords.latitude;
                  const long = postion.coords.longitude;
                  dispatch(setLocation({ lat:lat, log:long }));
                   
                  const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&type=postcode&format=json&apiKey=${apikey}`);
                    
                  const result = response.data.results[0].address_line1 || response.data.results[0].city;
                        
                 const fullAddress = response.data.results[0].address_line2 + " " + response.data.results[0].address_line1 + " " + " " + response.data.results[0].state + " " + response.data.results[0].country 
                // this is the full address that we will save in the database and use it for delivery and other purposes
                  dispatch(setAddress(fullAddress));
                  dispatch(setCurrentCity(result));
                  dispatch(setCurrentAddress(response.data.results[0].county ))
                  dispatch(setCurrentState(response.data.results[0].state))
                  dispatch(setCurrentCity(result));

                  

            })

      }, [userData])

}

export default UseGetCurrentCity;