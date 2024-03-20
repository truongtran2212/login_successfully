import * as React from "react";

import { useState } from "react";
// import Header from "./Header";
import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Breadcrumb, Layout, Menu } from "antd";
import "./Layout.css"
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import HeaderWeb from "./Header/HeaderWeb";
const { Header, Footer, Sider, Content } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

const CustomLayoutFC = ({ children }) => {
    const [isSidebar, setIsSidebar] = useState(false);
    const [theme, colorMode] = useMode();
    const [valueTabs, setValueTabs] = useState(null);

    const userInfo = useSelector((state) => state.getUserInfo.userInfo);
    useEffect(() => {
        if (userInfo) {
            // setIsSuperA(userInfo.is_superuser);
            // const arrPermission = userInfo.permission.map((item, index) => {
            //     return item.type;
            // });

            // setValueTabs(0);
            // if (arrPermission !== undefined) {
            //     if (
            //         arrPermission.includes(2) === true &&
            //         arrPermission.includes(1) === false
            //     ) {
            //         setValueTabs(1);
            //     }
            // }
        }
    }, [userInfo]);

    const [collapsed, setCollapsed] = useState(false);
    // const {
    //     token: { colorBgContainer },
    // } = theme.useToken();

    return (
        <>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div className="app" style={{ display: "flex" }}>
                        {/* <SideBarAdmin
                            isSidebar={isSidebar}
                            valueTabs={valueTabs}
                            setIsSidebar={setIsSidebar}
                        /> */}
                        {/* <SideBarUser
                            isSidebar={isSidebar}
                            valueTabs={valueTabs}
                            setIsSidebar={setIsSidebar}
                        /> */}
                        <main className="content1">
                            <HeaderWeb
                                setIsSidebar={setIsSidebar}
                                isSidebar={isSidebar}
                                valueTabs={valueTabs}
                                setValueTabs={setValueTabs}
                            />
                            <div className="container-fluid" style={{ maxWidth: "100%" }}>
                                {children}
                            </div>
                        </main>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </>
    );
};

export const CustomLayout = ({ isLogged, children }) => {
    const onUnAuth = () => {
        localStorage.setItem('loginRedirect', this.props.location.pathname)
        return "Chưa đăng nhập";
    };

    return isLogged ? <CustomLayoutFC children={children} /> : onUnAuth();

    // Test
    // return isLogged ? <CustomLayoutFC children={children} /> : <CustomLayoutFC children={children} />;
};
