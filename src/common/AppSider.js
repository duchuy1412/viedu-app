import {
  BarChartOutlined,
  EditOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AppSider.css";

const { Content, Sider } = Layout;

AppSider.propTypes = {};

function AppSider(props) {
  let location = useLocation();
  return (
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item
            key="/presentations"
            icon={<FundProjectionScreenOutlined />}
            title="Presentations"
          >
            <Link to="/presentations">Presentations</Link>
          </Menu.Item>
          <Menu.Item key="/questions" icon={<EditOutlined />} title="Questions">
            <Link to="/questions">Questions</Link>
          </Menu.Item>
          <Menu.Item key="/reports" icon={<BarChartOutlined />} title="Reports">
            <Link to="/reports">Reports</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout
        style={{
          padding: "0 24px 24px",
        }}
      >
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppSider;
