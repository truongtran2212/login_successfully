import {configureStore} from "@reduxjs/toolkit";
import authReducer from './Reducers/auth'
// import quantityNotiReducer from "./Reducers/getQuantityNoti";
import getUserInfo from "./Reducers/getUserInfo";
// import systemSlice from "./Reducers/getSystemInfo";
export const store = configureStore({
    reducer:{
        auth: authReducer,
        getUserInfo:getUserInfo,
        // getQuantityNoti:quantityNotiReducer,
    }
})