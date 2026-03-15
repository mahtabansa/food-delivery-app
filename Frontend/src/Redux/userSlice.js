import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import MyOrder from "../components/MyOrder";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentState: null,
    currentCity: null,
    currentAddress: null,
    shopsInMyCity: null,
    ItemsInMyCity: null,
    CardItems: [],
    TotalAmount: 0,
    Myorder: {
      orders: [],
    },
    SearchItem:null,
    socket:null,
  },
  reducers: {
    setUserData: (state, actions) => {
      state.userData = actions.payload;
    },
    setCurrentState: (state, actions) => {
      state.currentState = actions.payload;
    },
    setCurrentCity: (state, actions) => {
      state.currentCity = actions.payload;
    },

    setCurrentAddress: (state, actions) => {
      state.currentAddress = actions.payload;
    },
    setShopsInMyCity: (state, actions) => {
      state.shopsInMyCity = actions.payload;
    },
    setItemsInMyCity: (state, actions) => {
      state.ItemsInMyCity = actions.payload;
    },

    AddToCardItems: (state, actions) => {
      const NewItem = actions.payload;
      const existingItem = state.CardItems.find((i) => i._id === NewItem._id);
      if (existingItem) {
        existingItem.quantity += NewItem.quantity;
      } else {
        state.CardItems.push(NewItem);
      }

      state.TotalAmount = state.CardItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    updateQuantity: (state, actions) => {
      const { id, quantity } = actions.payload;
      const item = state.CardItems.find((i) => i._id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.TotalAmount = state.CardItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    removeItemFromCard: (state, actions) => {
      const id = actions.payload;
      const updatedcardItems = state.CardItems.filter((i) => i._id !== id);
      state.CardItems = updatedcardItems;
      state.TotalAmount = state.CardItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    setMyorder: (state, actions) => {
      state.Myorder = actions.payload;
    },
    addMyOrder: (state, actions) => {
      state.Myorder = [actions.payload, state.Myorder];
    },

    updateStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;

      const order = state.Myorder.orders.find((o) => o._id === orderId);
      if (!order) return;

      const shopOrder = order.shopOrder.find((s) => s.shop._id === shopId);
      if (!shopOrder) return;

      shopOrder.status = status;
    },
      clearUser: (state) => {
      state.userData = null;
    },

    setSearchItem:(state,action)=>{
      state.SearchItem = action.payload
    },
    setSocket:(state,action)=>{
      state.socket=action.payload
    }
  },
});
export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setShopsInMyCity,
  setItemsInMyCity,
  AddToCardItems,
  updateQuantity,
  removeItemFromCard,
  TotalAmount,
  setMyorder,
  addMyOrder,
  updateStatus,
  clearUser,
  setSearchItem,
  setSocket
} = userSlice.actions;

export const userReducer = userSlice.reducer;
export default userSlice.reducer;
