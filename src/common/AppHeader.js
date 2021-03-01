import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Icon, Layout, Menu } from "antd";
import { Link, withRouter } from "react-router-dom";
import pollIcon from "../poll.svg";
import "./AppHeader.css";

const Header = Layout.Header;

const AppHeader = (props) => {
  const { currentUser } = props;

  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="/change-password">
          Thay đổi mật khẩu
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="/settings">
          Cài đặt
        </a>
      </Menu.Item>
      <Menu.Item danger onClick={props.onLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  let menuItems;
  if (props.currentUser) {
    menuItems = [
      <Menu.Item key="/">
        <Link to="/">
          <Icon type="home" className="nav-icon" />
        </Link>
      </Menu.Item>,
      <Menu.Item key="/presentations">
        <Link to="/presentations">
          <img src={pollIcon} alt="poll" className="poll-icon" />
        </Link>
      </Menu.Item>,
      <Menu.Item key="/profile" className="profile-menu">
        <Dropdown overlay={menu}>
          <a
            className="ant-dropdown-link"
            href="/user/me"
            onClick={(e) => e.preventDefault()}
          >
            {currentUser.name} <DownOutlined />
          </a>
        </Dropdown>
      </Menu.Item>,
    ];
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

  return (
    <Header className="app-header">
      <div className="container">
        <span className="app-title">
          <Link to="/">VIEDU APP</Link>
        </span>
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
