import React, { useEffect, useState } from "react";
import Login from "../login/Login";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useLocation,
} from "react-router-dom";
import UserLayout from "../UserLayout";
import { authSuccess } from "../../app/Actions/auth";
import NotPermission from "../notPermission";
import NotfoundLayout from "../notfoundLayout";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { CustomLayout } from "../../layout/Layout";
import Management from "../management/Management";
import { getUserInfo } from "../../app/Reducers/getUserInfo";

const cookies = new Cookies();

function PageTitleUpdater() {
    const location = useLocation();

    React.useEffect(() => {
        const path = location.pathname;
        let pageTitle = "IWAKI"; // Đặt tiêu đề mặc định

        // Cập nhật tiêu đề dựa trên URL
        if (path === "/") {
            pageTitle = "QC management";
        } else if (path === "/export-document") {
            pageTitle = "Tùy chọn mẫu xuất hóa đơn";
        } else if (path === "/category-master") {
            pageTitle = "Danh mục Master";
        } else if (path === "/invoice") {
            pageTitle = "Hóa đơn";
        } else if (path === "/statement") {
            pageTitle = "Sao kê";
        } else if (path === "/history") {
            pageTitle = "Lịch sử tải lên";
        } else if (path === "/accounting-invoice") {
            pageTitle = "Định khoản hóa đơn";
        } else if (path === "/accounting-statement") {
            pageTitle = "Định khoản sao kê";
        }

        // Cập nhật tiêu đề trang
        document.title = pageTitle;
    }, [location]);

    return null;
}

function Main() {
    const dispatch = useDispatch();
    // const userInfo = useSelector((state) => state.getUserInfo.userInfo);
    const [lsPermissions, setLsPermissions] = useState([]);
    const [lsPermissionsType, setLsPermissionsType] = useState([]);
    // const history = useHistory();

    const token = cookies.get("token_iwaki");
    if (token) {
        dispatch(authSuccess(token));
    }
    const auth = useSelector((state) => state.auth.token) !== null;
    const userInfo = useSelector((state) => state.getUserInfo.userInfo);
    useEffect(() => {
        console.log(auth)
        console.log(token)
        if (auth && token) {
            dispatch(getUserInfo());
        }
    }, [auth, dispatch, token]);

    useEffect(() => {
        console.log(userInfo)
        if (Object.keys(userInfo).length !== 0 && userInfo !== undefined) {
            setLsPermissions([userInfo.role_name]);
        }

    }, [userInfo]);
    return (
        <Router>
            <PageTitleUpdater />
            <Switch>
                <ProtectLoginRoute
                    exact
                    path="/login"
                    protect={auth}
                    user_info={userInfo}
                >
                    <UserLayout>
                        <Login />
                    </UserLayout>
                </ProtectLoginRoute>
                <RouteWithLayout
                    component={Management}
                    exact
                    layout={CustomLayout}
                    path="/"
                    isPrivate={true}
                    lsPermissions={lsPermissions}
                    permission={["Admin"]}
                    isLogged={auth}
                />
                

            </Switch>
        </Router>
    );
}

const RouteWithLayout = (props) => {
    const {
        layout: Layout,
        // eslint-disable-next-line no-useless-rename
        isLogged: isLogged,
        component: Component,
        // eslint-disable-next-line no-useless-rename
        isPrivate: isPrivate,
        // eslint-disable-next-line no-useless-rename
        lsPermissions: lsPermissions,
        // eslint-disable-next-line no-useless-rename
        permission: permission,
        // eslint-disable-next-line no-useless-rename
        path: path,
        // eslint-disable-next-line no-useless-rename
        isSuperA: isSuperA,
        ...rest
    } = props;

    const getRejectRoute = (type) => {
        if (type !== "404" && path !== "/") {
            type = "403";
        }

        switch (type) {
            case "403":
                return <NotPermission />;
            case "404":
                return <NotfoundLayout />;
            default:
                return <NotPermission />;
        }
    };
    return (
        <Route
            {...rest}
            render={() =>
                isPrivate ? (
                    isLogged ? (
                        lsPermissions && lsPermissions.length > 0 ? (
                            lsPermissions.some((r) => permission.includes(r)) ? (
                                <Layout isLogged={isLogged}>
                                    <Component {...props} />
                                </Layout>
                            ) : (
                                getRejectRoute(permission)
                            )
                        ) : (
                            <span></span>
                        )
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location },
                            }}
                        />
                    )
                ) : (
                    <Layout isLogged={isLogged}>
                        <Component {...props} />
                    </Layout>
                )
            }
        />
    );
};

const ProtectLoginRoute = ({
    protect,
    lsPermissionsType,
    lsPermissions,
    user_info,
    children,
    ...rest
}) => {
    return (
        <>
            <Route
                {...rest}
                render={() =>
                    !protect ? (
                        children
                    ) : (
                        <>
                            <Redirect to="/"></Redirect>
                        </>
                    )
                }
            />
        </>
    );
};

export default Main;
