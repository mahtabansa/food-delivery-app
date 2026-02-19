import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity } from '../Redux/userSlice.js';
import axios from 'axios';

const UseGetItemsInCity = () => {
      const dispatch = useDispatch();
      const { currentCity } = useSelector((state) => state.user);
 

      useEffect(() => {
             if (!currentCity) return;

            const fetchItem = async () => {
                  const result = await axios.get(`http://localhost:8000/api/item/get-item-bycity/${currentCity}`,
                         { withCredentials: true });
                  console.log("result in fetch Item", result.data);
                  dispatch(setItemsInMyCity(result.data))

            }
            fetchItem();

      }, [currentCity])
       

}

export default UseGetItemsInCity