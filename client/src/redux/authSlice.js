import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        },
        logout: {
            isFetching: false,
            error: false
        },
        msgErr: ''
    },
    reducers:{
        loginStart: (state)=>{
            state.login.isFetching = true;
        },
        loginSuccess: (state, action)=>{
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state, action)=>{
            state.login.isFetching = false;
            state.login.currentUser = false;
            state.login.error = true;
            state.msgErr = action.payload
        },

        registerStart: (state)=>{
            state.register.isFetching = true;
        },
        registerSuccess: (state)=>{
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true
        },
        registerFailed: (state)=>{
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false
        },

        logoutStart: (state)=>{
            state.login.isFetching = true;
            state.login.error= false
        },
        logoutSuccess: (state)=>{
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = null
        },
        logoutFailed: (state)=>{
            state.login.isFetching = false;
        },
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailed,

    registerStart,
    registerSuccess,
    registerFailed,

    logoutStart,
    logoutSuccess,
    logoutFailed,
} = authSlice.actions

export default authSlice.reducer