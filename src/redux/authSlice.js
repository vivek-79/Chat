import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    status: false,
    userData: {}
}

const authSlice = createSlice({
    initialState,
    name: 'auth',

    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload
        },
        logout: (state, action) => {
            state.status = false;
            state.userData = ''
        }
    }
})

export const {login,logout} = authSlice.actions;

export default authSlice.reducer