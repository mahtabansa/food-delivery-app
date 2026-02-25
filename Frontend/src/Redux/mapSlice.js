import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
      name:"map",
      initialState:{
            location:{
                  lat:null,
                  log:null
            },
            address:null
      },

      reducers:{
            setLocation:(state,action)=> {
                  const {lat,log} = action.payload;
                  state.location.lat = lat;
                  state.location.log = log;
            },
            setAddress:(state,action)=> {
                  state.address = action.payload;
            }
      }
})

export const {setLocation,setAddress} = mapSlice.actions;
export const mapReducer = mapSlice.reducer;
