import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import './Header.css'
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { tokens } from "../../theme";
import { Avatar, Col, Row } from "antd";
import { GoCircle } from "react-icons/go";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PersonIcon from '@mui/icons-material/Person';
import LogoRS from "../../images/LogoRainScaleLogin.svg"
import LogoutIcon from '@mui/icons-material/Logout';
import { authAxios } from "../../api/axiosClient";
import { logoutURL } from "../../constants";
import { logout } from "../../app/Actions/auth";
const cookies = new Cookies();
const HeaderWeb = ({
  setValueTabs,
  setIsSidebar,
  isSidebar,
}) => {
  const theme = useTheme();
  const [isAnchorEl, setIsAnchorEl] = useState(null);
  const open = Boolean(isAnchorEl);
  const history = useHistory();
  const userInfo = useSelector((state) => state.getUserInfo.userInfo);
  const [lsPermissions, setLsPermissions] = useState([]);

  const handleClickPerson = (event) => {
    setIsAnchorEl(event.currentTarget);
  };

  const handleClosePerson = () => {
    setIsAnchorEl(null);
  };

  const handleClickChangePW = () => {
    // setIsAnchorEl(null);
    // history.push("/change_password");
  };

  const onClickAdmin = () => {
    setIsAnchorEl(null);
    history.push("/user");
  };

  useEffect(() => {
    // if (userInfo) {
    //   const arrPermission = userInfo.permission.map((item, index) => {
    //     return item.name;
    //   });

    //   const arrPermissionType = userInfo.permission.map((item, index) => {
    //     return item.type;
    //   });

    //   if (arrPermission !== undefined) {
    //     setLsPermissions([...arrPermission]);
    //   }

    //   if (arrPermissionType !== undefined) {
    //     setLsPermissionsType([...arrPermissionType]);
    //   }
    // }
  }, [userInfo]);

  const showTitlePage = () => {
    if (window.location.pathname === "/") {
      return titleOfManageSystem("Thông tin doanh nghiệp")
    } else if (window.location.pathname === "/category-master") {
      return titleOfManageSystem("Danh mục Master")
    }
    else if (window.location.pathname === "/export-document") {
      return titleOfManageSystem("Tùy chọn mẫu xuất hóa đơn")
    }
    else if (window.location.pathname === "/invoice") {
      return titleOfManageDocs("Hóa đơn")
    }
    else if (window.location.pathname === "/statement") {
      return titleOfManageDocs("Sao kê")
    }
    else if (window.location.pathname === "/history") {
      return titleOfManageDocs("Lịch sử tải lên")
    }
    else if (window.location.pathname === "/accounting-invoice") {
      return titleOfAccounting("Định khoản hóa đơn")
    }
    else if (window.location.pathname === "/accounting-statement") {
      return titleOfAccounting("Định khoản sao kê")
    }
  }

  const titleOfManageSystem = (title) => {
  }

  const titleOfManageDocs = (title) => {
  }

  const titleOfAccounting = (title) => {
  }

  useEffect(() => {
    showTitlePage()
  }, []);

  const IconCircle = () => {
    return (
      <GoCircle style={{ fontSize: 8, borderRadius: "50%", marginBottom: "0.5%", color: "#058DF4", background: "#058DF4" }} />
    )
  }

  const logout_new = (e) => {
    console.log("Log out")
    authAxios()
        .get(logoutURL)
        .then((res) => {
            //tắt
            cookies.remove("token_iwaki");
            cookies.remove("refresh_iwaki");
            cookies.remove("csrftoken");
            window.location = "/";
        });
    logout();
};

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        backgroundColor: "#fff",
        height: "8vh",
        width: "100%",
        // padding: window.screen.availHeight < 800 ? 1 : 2,
      }}
    >
      {/* SEARCH BAR */}
      <Row style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
        <Col span={18}>
          <Box
            display="flex"
            // backgroundColor={colors.primary[400]}
            borderRadius="3px"
            sx={{ justifyContent: "flex-start", paddingLeft: "24px" }}
          >
            <img src={LogoRS} alt=""></img>
          </Box>
        </Col>
        {/* ICONS */}
        <Col span={6}>
          <Box display="flex" sx={{ float: "right", paddingRight: "24px" }}>
            {/* <IconButton>
              <img src={IconNotification} alt=""></img>
            </IconButton> */}
            <Button
              variant="outlined"
              onClick={handleClickPerson}
              startIcon={<Avatar
                style={{
                  backgroundColor: 'rgba(5, 141, 244, 0.1)',
                  color: '#058DF4',
                }}
              >
                {/* {userInfo && userInfo.username.substr(0, 1)} */}
              </Avatar>}
              // endIcon={<ExpandMoreOutlined />}
              className="btnInfoUser"
              style={{ height: "70%", float: "right" }}
            >
              {/* {userInfo && userInfo.username} */}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={isAnchorEl}
              open={open}
              style={{width: "158px"}}
              onClose={handleClosePerson}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}


            >
              {lsPermissions.includes("Admin Operation") === true && (
                <MenuItem onClick={onClickAdmin}>Admin</MenuItem>
              )}
              <MenuItem style={{width: "100%"}} className={"menu-user"} onClick={() => logout_new()}><LogoutIcon style={{ marginRight: "5%"  }} />Log out</MenuItem>
              {/* <MenuItem className={"menu-user"} onClick={handleClickChangePW}><VpnKeyIcon style={{ marginRight: "5%" }} />Thay đổi mật khẩu</MenuItem> */}
            </Menu>
          </Box>
        </Col>
      </Row>
    </Box>
  );
};

export default HeaderWeb;
