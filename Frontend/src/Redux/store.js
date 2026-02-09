import { configureStore } from '@reduxjs/toolkit'

// export default store

import  {userReducer} from './userSlice.js'  // Correct!
import  {ownerReducer}  from './ownerSlice.js'
// import userSlice from './userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,owner:ownerReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
})