
import { configureStore } from "@reduxjs/toolkit";
import authSliceReducers from './authSlice'
const store = configureStore({
    reducer:{
        auth:authSliceReducers,
    }
})

export default store