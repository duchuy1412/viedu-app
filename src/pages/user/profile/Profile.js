import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
} from "util/APIUtils";
import {
  Avatar,
  Tabs,
  Card,
  Input,
  Button,
  Form,
  Row,
  Col,
  notification,
} from "antd";
import { getAvatarColor } from "util/Colors";
import LoadingIndicator from "common/LoadingIndicator";
import "./Profile.css";
import NotFound from "common/NotFound";
import ServerError from "common/ServerError";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "constants/index";

const TabPane = Tabs.TabPane;

const Profile = (props) => {
  const { currentUser } = props;

  const [form] = Form.useForm();
  const [formChangePass] = Form.useForm();

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ notFound: false, serverError: false });

  function loadUserProfile(username) {
    setLoading(true);

    getUserProfile(username)
      .then((response) => {
        // console.log(response);
        setUserProfile(response);
        setLoading(false);
      })
      .catch((error) => {
        if (error.status === 404) {
          setStatus({ ...status, notFound: true });
          setLoading(false);
        } else {
          setStatus({ ...status, serverError: true });
          setLoading(false);
        }
      });
  }

  useEffect(() => {
    loadUserProfile(currentUser.username);
  }, [currentUser]);

  useEffect(() => {
    userProfile && form.setFieldsValue(userProfile);

    return () => {
      form.resetFields();
    };
  }, [userProfile]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (status.notFound) {
    return <NotFound />;
  }

  if (status.serverError) {
    return <ServerError />;
  }

  const tabBarStyle = {
    textAlign: "center",
  };

  const onFinish = (values) => {
    // console.log(values);
    updateUserProfile(values)
      .then((res) => {
        notification.success({ message: "Saved!" });
      })
      .catch((error) => notification.error({ message: "Error!" }));
  };

  const onChangePasswd = (values) => {
    // console.log(values);
    const { oldPassword, newPassword } = values;
    updatePassword(newPassword, oldPassword)
      .then((res) => {
        notification.success({ message: "Successfully!" });
      })
      .catch((error) => {
        notification.error({ message: "Error" });
      });
    formChangePass.resetFields();
  };

  return (
    <div className="profile">
      {props.isAuthenticated && userProfile ? (
        <div className="user-profile">
          <div className="user-details">
            <div className="user-avatar">
              <Avatar
                className="user-avatar-circle"
                style={{
                  backgroundColor: getAvatarColor(userProfile.name),
                }}
              >
                {userProfile.name[0].toUpperCase()}
              </Avatar>
            </div>
            <div className="user-summary">
              <div className="full-name">{userProfile.name}</div>
              <div className="username">@{userProfile.username}</div>
            </div>
          </div>
          <div>
            <Tabs
              defaultActiveKey="1"
              animated={false}
              tabBarStyle={tabBarStyle}
              size="large"
              className="profile-tabs"
              centered
            >
              <TabPane tab={`Information`} key="1">
                <div
                  className="site-card-border-less-wrapper"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Card title="User Information" style={{ width: "50%" }}>
                    <Form
                      form={form}
                      name="basic"
                      onFinish={onFinish}
                      className="signup-form"
                      layout="vertical"
                    >
                      <Form.Item name="id" label="Id" hidden>
                        <Input disabled />
                      </Form.Item>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="username" label="Username">
                            <Input size="large" placeholder="" disabled />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="name" label="Full name">
                            <Input size="large" placeholder="" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item name="email" label="Email">
                        <Input size="large" placeholder="" />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          className="signup-form-button"
                        >
                          Save
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </div>
              </TabPane>
              <TabPane tab={`Change Password`} key="2">
                <div
                  className="site-card-border-less-wrapper"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Card title="Password" style={{ width: "50%" }}>
                    <Form
                      form={formChangePass}
                      name="changePass"
                      onFinish={onChangePasswd}
                      className="change-password-form"
                      layout="vertical"
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="oldPassword"
                            label="Old password"
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                message: "Please input your password!",
                              },
                            ]}
                          >
                            <Input.Password
                              size="large"
                              placeholder=""
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeTwoTone />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}></Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="newPassword"
                            label="New password"
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                // message: "Please input your new password!",
                                min: PASSWORD_MIN_LENGTH,
                                max: PASSWORD_MAX_LENGTH,
                              },
                            ]}
                          >
                            <Input.Password
                              size="large"
                              placeholder=""
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeTwoTone />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="confirmNewPassword"
                            label="Confirm new password"
                            dependencies={["newPassword"]}
                            hasFeedback
                            rules={[
                              {
                                required: true,
                                message: "Please confirm your new password!",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("newPassword") === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "The two passwords that you entered do not match!"
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              size="large"
                              placeholder=""
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeTwoTone />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          className="signup-form-button"
                        >
                          Save
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
