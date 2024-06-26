import axios from "axios";
import * as actionTypes from "./actionTypes";
import Cookies from 'universal-cookie';
import { loginURL } from "../../constants";
// import { openNotificationWithIcon } from "../../Function";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import "./auth.css"
import { openNotificationWithIcon } from "../../Function";
// import ErrorImage from "../../images/ErrorNotifiIcon.svg"
// import {openNotificationWithIcon} from "../../containers/Function";
const cookies = new Cookies();
const MySwal = withReactContent(Swal);

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};


export const authSuccess = token => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    };
};

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

const onNotification = (message, titleBtn) => {
    MySwal.fire({
        timer: 1000000000,
        title: <span className="text-error">Yêu cầu thất bại</span>,
        html: <i style={{fontSize: 16}}>{message}</i>,
        // icon: "success",
        // imageUrl: ErrorImage,
        showConfirmButton: false,
        // confirmButtonText: <span className="title-btn">{titleBtn} &nbsp;> </span>,
        // confirmButtonColor: "#fff",
        customClass: {
            icon: "my-custom-icon-class", // Thêm class tùy chỉnh cho biểu tượng
            popup: "custom-notification",
            // confirmButton: "custom-confirm-btn"
            // image: "custom-image"
        },
        position: "top",
        // width: screenWindown768px === true ? "80%" : "20%",
    });
}


export const authLogin = (username, password, loading) => {
    return dispatch => {
        loading(true)
        dispatch(authStart());
        axios
            .post(loginURL, {
                username: username,
                password: password
            })
            .then(res => {
                const token = res.data.access;
                const refresh = res.data.refresh;
                cookies.set('token_iwaki', token);
                cookies.set('refresh_iwaki', refresh);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(60 * 60 * 24 * 15)); // 15d
                loading(false)
            })
            .catch(err => {
                loading(false)
                console.log(err)
                console.log(12312312312)
                // openNotificationWithIcon('error', 'Lỗi kết nối', 'Lỗi kết nối, kiểm tra kết nối tới server !!!')
                if (err.request.status === 401) {
                    
                    onNotification(err.response.data.message, 'Tiếp tục')
                    // message.error('Lỗi kết nối, kiểm tra kết nối tới server !!!', 10);
                }
                if (err.request.status === 400) {
                    onNotification(err.response.data.message, 'Tiếp tục')
                    // message.error('Lỗi kết nối, kiểm tra kết nối tới server !!!', 10);
                }
                if (err.request.status === 0) {
                    openNotificationWithIcon('error', 'CONNECTION ERROR', 'Please check the connection to the server !!!')
                    // message.error('Lỗi kết nối, kiểm tra kết nối tới server !!!', 10);
                }
                dispatch(authFail(err));
            });
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = cookies.get("token_iwaki");
        if (token === undefined) {
            dispatch(logout());
        } else {
            dispatch(authSuccess(token));
        }
    };
};