import React, { useEffect, useState } from 'react'
import Logo from "../../images/LogoLogin.svg"
import LogoRS from "../../images/LogoRainScaleLogin.svg"
import UserIcon from "../../images/UserIcon.svg"
import LockIcon from "../../images/LockIcon.svg"
import Arrow from "../../images/ArrowIconLogin.svg"
import "./Login.css"
import { Link, Redirect, Route } from "react-router-dom";

import { Button, Checkbox, Col, Form, Input, Row } from 'antd'
import Cookies from 'universal-cookie'
import { authLogin } from '../../app/Actions/auth'
import { connect } from 'react-redux'
const cookies = new Cookies();

function setCookieRemember(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();

    // Mã hóa dữ liệu trước khi lưu vào cookie
    const encodedValue = window.btoa(cvalue); // Mã hóa dữ liệu bằng Base64
    document.cookie = cname + "=" + encodedValue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let c = cookieArray[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            const encodedValue = c.substring(name.length, c.length);
            // Giải mã dữ liệu khi lấy từ cookie
            return window.atob(encodedValue); // Giải mã dữ liệu từ Base64
        }
    }
    return "";
}
class Login extends React.Component {
    state = {
        username: "",
        password: "",
        loadings: false,
        modalVisibleRestPass: false,
        isFocusedUser: false,
        isFocusedPass: false,
        checked: "",
        openModalContact: false,
        openForgetPassword: false,
        openCreateNewPassword: false,
    };

    onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    handleModalForgotPass = () => {
        this.setState({
            modalVisibleRestPass: true,
        });
    };

    handleModalCancel = () => {
        this.setState({ modalVisibleRestPass: false });
    };

    handleFocus = () => {
        this.setState({ isFocusedUser: true });
    };

    handleBlur = () => {
        this.setState({ isFocusedUser: false });
    };

    handleFocus1 = () => {
        this.setState({ isFocusedPass: true });
    };

    handleBlur1 = () => {
        this.setState({ isFocusedPass: false });
    };

    onChangeRemember = (e) => {
        console.log(e)
        localStorage.setItem("remember_me", e.target.checked);
        this.setState({ checked: e.target.checked });
    };

    handleOpenModalContact = () => {
        this.setState({ openModalContact: true });
    };

    handleCloseModalContact = () => {
        this.setState({ openModalContact: false });
    };

    handleLoading = (value) => {
        this.setState({ loadings: value });
    };

    handleOpenForgerPassword = () => {
        window.location = "/forgot-password"
    }

    constructor(props) {
        super(props);
        this.state = {
            username: getCookie("c_u") || "", // Lấy giá trị từ localStorage
            password: getCookie("c_p") || "",
            // checked: localStorage.getItem("remember_me") || ""
            // remember_me: localStorage.getItem("remember_me") || "",
            // Các trạng thái khác của component
        };
    }


    componentDidMount() {
        console.log(123123);
    }

    render() {
        const { loading, token } = this.props;
        const {
            loadings,
            isFocusedUser,
            isFocusedPass,
            checked,
            username,
            password,
            openForgetPassword,
        } = this.state;
        if (token) {
            // localStorage.setItem("currentSelectedKeys", JSON.stringify(['2']))
            return <Redirect to="/login" />;
        }


        // const ToastWarning = Swal.mixin({
        //     toast: true,
        //     position: "top",
        //     showConfirmButton: false,
        //     timer: 2000,
        //     timerProgressBar: true,
        //     didOpen: (toast) => {
        //         toast.addEventListener("mouseenter", Swal.stopTimer);
        //         toast.addEventListener("mouseleave", Swal.resumeTimer);
        //     },
        //     customClass: {
        //         popup: "my-custom-popup",
        //         timerProgressBar: "my-custom-progress-bar-warning", // Thêm class tùy chỉnh
        //     },
        // });

        const onFinish = (values) => {
            // this.setState({ loadings: true });
            this.props.login(values.username, values.password, (e) => this.handleLoading(e));
            const checkRemember = localStorage.getItem('remember_me') !== undefined && localStorage.getItem('remember_me') === "true"
            if (checkRemember === true) {
                setCookieRemember("c_u", values.username, 1)
                setCookieRemember("c_p", values.password, 1)
            } else {
                cookies.remove("c_u")
                cookies.remove("c_p")
                // localStorage.setItem('remember_me', false)
            }
            // this.setState({ loadings: false });
        };



        // const handleClickForgot = () => {
        //     ToastWarning.fire({
        //         icon: "warning",
        //         title: "Tính năng đang phát triển!",
        //     });
        // };

        const handleNoti = () => {
            // onNotification("Tính năng đang phát triển")
        }

        return (
            <>
                <div className='custom-center' style={{ width: "100%", height: "100vh", background: "rgba(118, 128, 157, 0.10)", position: "relative" }}>
                    <div className='custom-center' style={{ backgroundImage: `url(${Logo})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "58%" }}>
                        <div style={{ width: "50%", paddingTop: "11%" }}>
                            <h3 className='custom-center'>
                                <img src={LogoRS} alt=''></img>
                            </h3>
                            <div className='custom-center' style={{ width: "100%", flexDirection: "column" }}>
                                <div style={{ width: "100%" }}>
                                    <h5 className='title-box-login'>
                                        welcome
                                    </h5>
                                    <Form
                                        // form={form}
                                        // initialValues={{
                                        //     username: username || "",
                                        //     password: password || "",
                                        // }}
                                        name="control-hooks"
                                        layout='vertical'
                                        onFinish={onFinish}

                                    // validateMessages={validateMessages}
                                    // style={{ maxWidth: 600 }}
                                    >
                                        <Form.Item
                                            name="username"
                                            label="Username"
                                            className='custom-border'
                                            rules={[{ required: true, message: "Please enter a username" }]}
                                        >
                                            <Input className='input-sign-up' suffix={<img src={UserIcon} alt=''></img>} placeholder='Username' />
                                        </Form.Item>
                                        <Form.Item
                                            name="password"
                                            label="Password"
                                            className='custom-border'
                                            rules={[{ required: true, message: "Please enter a password" }]}
                                        >
                                            <Input.Password className='input-sign-up' suffix={<img src={LockIcon} alt=''></img>} placeholder='Password' />
                                        </Form.Item>
                                        {/* <Row>
                                    <Col span={12}>
                                        <Checkbox className='checkbox-sign-up' defaultChecked={localStorage.getItem('remember_me') !== undefined && localStorage.getItem('remember_me') === "true" ? true : false} style={{ float: "left" }} onChange={this.onChangeRemember}>Ghi nhớ mật khẩu</Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <span className='forget-password' style={{ float: "right" }} onClick={() => this.handleOpenForgerPassword()}>Quên mật khẩu</span>
                                    </Col>
                                </Row> */}
                                        <Row style={{ marginTop: "5%" }}>
                                            <Button className='btn-login' htmlType='submit'>Sign in <img src={Arrow} style={{ marginTop: "0.7%" }} alt=''></img></Button>
                                        </Row>

                                        {/* <Row className='custom-center' style={{ marginTop: "3%" }}>
                                    <span className='text-or'>Hoặc</span>
                                </Row>

                                <Row style={{ marginTop: "3%" }}>
                                    <Button onClick={handleNoti} className='btn-for-guest'>Đăng nhập không cần mật khẩu</Button>
                                </Row> */}
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (username, password, loading) => dispatch(authLogin(username, password, loading)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);