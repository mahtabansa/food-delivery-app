import { configureStore } from '@reduxjs/toolkit'

import  {userReducer} from './userSlice.js'  // Correct!
import  {ownerReducer}  from './ownerSlice.js'
import {mapReducer} from './mapSlice.js'

export const store = configureStore({
  reducer: {
    user: userReducer,owner:ownerReducer,map:mapReducer,
  },
  devTools: process.env.NODE_ENV !== 'production'
})