import { configureStore } from '@reduxjs/toolkit'

// export default store

import { userReducer } from './userSlice'  // Correct!
// import userSlice from './userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
})