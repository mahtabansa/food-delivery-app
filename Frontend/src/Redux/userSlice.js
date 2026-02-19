import { createSlice, current } from '@reduxjs/toolkit'

const userSlice = createSlice({
      name:"user",
      initialState:{
        userData:null,
        currentState:null,
        currentCity:null,
        currentAddress:null,
        shopsInMyCity:null,
        ItemsInMyCity:null

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
             },
             setShopsInMyCity:(state,actions)=>{
              state.shopsInMyCity=actions.payload;
             },
             setItemsInMyCity:(state,actions)=>{
              state.ItemsInMyCity=actions.payload;
             }

      }
})
export const {setUserData,setCurrentCity,setCurrentState,setCurrentAddress,setShopsInMyCity,setItemsInMyCity}= userSlice.actions;

export const userReducer = userSlice.reducer;
export default userSlice.reducer