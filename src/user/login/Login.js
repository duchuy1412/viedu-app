import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, notification } from "antd";
import React from "react";
import "./Login.css";
import { ACCESS_TOKEN } from "../../constants";
import { login } from "../../util/APIUtils";

const Login = (props) => {
  return (
    <div className="login-container">
      <h1 className="page-title">Login</h1>
      <div className="login-content">
        <LoginForm {...props} />
      </div>
    </div>
  );
};

const LoginForm = (props) => {
  const onFinish = (values) => {
    // console.log("Received values of form: ", values);

    const loginRequest = Object.assign({}, values);

    login(loginRequest)
      .then((response) => {
        localStorage.setItem(ACCESS_TOKEN, response.token);
        props.onLogin();
      })
      .catch((error) => {
        if (error.status === 401) {
          notification.error({
            message: "Viedu App",
            description:
              "Your Username or Password is incorrect. Please try again!",
          });
        } else {
          notification.error({
            message: "Viedu App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
      });
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your Username!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="forgot">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="/signup">register now!</a>
      </Form.Item>
    </Form>
  );
};

export default Login;
