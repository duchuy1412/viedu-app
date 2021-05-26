import {
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Layout, Menu, Typography, Avatar } from "antd";
import { Link, withRouter } from "react-router-dom";
import { getAvatarColor } from "util/Colors";
import "./AppHeader.css";

const Header = Layout.Header;

const getFisrtLetter = (string) => {
  return string ? string[0].toUpperCase() : "U";
};

const AppHeader = (props) => {
  const { currentUser } = props;

  const menu = (
    <Menu>
      <Menu.Item>
        <a href="/user">
          <SettingOutlined /> Settings
        </a>
      </Menu.Item>
      <Menu.Item danger onClick={props.onLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  const notification = (
    <Menu>
      <Menu.Item>Notification!</Menu.Item>
    </Menu>
  );

  let menuItems;
  if (props.currentUser) {
    menuItems = [
      <Menu.Item key="/notification">
        <Dropdown
          overlay={notification}
          placement="bottomCenter"
          trigger={["click"]}
        >
          <a
            className="ant-dropdown-link"
            href="/notification"
            onClick={(e) => e.preventDefault()}
          >
            <Badge dot offset={[-5, 0]}>
              <BellOutlined style={{ fontSize: 25 }} />
            </Badge>
          </a>
        </Dropdown>
      </Menu.Item>,
      <Menu.Item key="/profile" className="profile-menu">
        <Dropdown overlay={menu} trigger={["click"]}>
          <span>
            <Avatar
              style={{
                color: "#fff",
                backgroundColor: getAvatarColor(currentUser.name),
              }}
            >
              {getFisrtLetter(currentUser.name)}
            </Avatar>{" "}
            <a
              className="ant-dropdown-link"
              href="/user"
              onClick={(e) => e.preventDefault()}
            >
              {currentUser.name} <DownOutlined />
            </a>
          </span>
        </Dropdown>
      </Menu.Item>,
    ];
  } else {
    if (
      props.location.pathname.startsWith("/audience") ||
      props.location.pathname.startsWith("/go")
    ) {
      menuItems = [];
    } else {
      menuItems = [
        <Menu.Item key="/login">
          <Link to="/login">Login</Link>
        </Menu.Item>,
        <Menu.Item key="/signup">
          <Link to="/signup">Signup</Link>
        </Menu.Item>,
      ];
    }
  }

  return (
    <Header className="app-header">
      <div className="container">
        <Typography.Text className="app-title">
          <Link to="/">VIEDU APP</Link>
        </Typography.Text>
        <Menu
          className="app-menu"
          mode="horizontal"
          selectedKeys={props.location.pathname}
          style={{ lineHeight: "64px" }}
        >
          {menuItems}
        </Menu>
      </div>
    </Header>
  );
};

export default withRouter(AppHeader);
