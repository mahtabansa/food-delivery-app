import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
      name:"user",
      initialState:{
        userData:null,
        city:null,

      },
      reducers:{
             setUserData:(state,actions)=>{
               state.userData=actions.payload;
             },
             setCurrentCity:(state,actions)=>{
                   state.city=actions.payload;
             }
      }
})
export const {setUserData,setCurrentCity}= userSlice.actions;

export const userReducer = userSlice.reducer;
export default userSlice.reducer