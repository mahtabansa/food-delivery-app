import { createSlice, current } from '@reduxjs/toolkit'

const userSlice = createSlice({
      name:"user",
      initialState:{
        userData:null,
        currentState:null,
        currentCity:null,
        currentAddress:null,

      },
      reducers:{
             setUserData:(state,actions)=>{
               state.userData=actions.payload;
             },
              setCurrentState:(state,actions)=>{
              state.currentState=actions.payload;
             },
             setCurrentCity:(state,actions)=>{
                   state.currentCity=actions.payload;
             },
          
             setCurrentAddress:(state,actions)=> {
                state.currentAddress=actions.payload;
             }

      }
})
export const {setUserData,setCurrentCity,setCurrentState,setCurrentAddress}= userSlice.actions;

export const userReducer = userSlice.reducer;
export default userSlice.reducer