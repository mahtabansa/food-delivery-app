import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
      name:"owner",
      initialState:{
            myShopData:null
      },

      reducers:{
         setMyShopData:(state,actions)=>{
            state.myShopData=actions.payload
         }
      }

})
export const {setMyShopData} = ownerSlice.actions;

export const ownerReducer = ownerSlice.reducer;
export default ownerSlice.reducer;
