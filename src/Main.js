import {
  EditOutlined,
  FundProjectionScreenOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import React from "react";
import PresentationList from "./component/PresentationList";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const Main = () => {
  return (
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item
            key="sub1"
            icon={<FundProjectionScreenOutlined />}
            title="subnav 1"
          >
            Presentations
          </Menu.Item>
          <Menu.Item key="sub2" icon={<EditOutlined />} title="subnav 2">
            Questions
          </Menu.Item>
          <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
            <Menu.Item key="9">option9</Menu.Item>
            <Menu.Item key="10">option10</Menu.Item>
            <Menu.Item key="11">option11</Menu.Item>
            <Menu.Item key="12">option12</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <PresentationList />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
