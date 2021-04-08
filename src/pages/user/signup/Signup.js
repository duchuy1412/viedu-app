import React, { useState } from "react";
import {
  signup,
  checkUsernameAvailability,
  checkEmailAvailability,
} from "../../../util/APIUtils";
import "./Signup.css";
import { Link, useHistory } from "react-router-dom";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "../../../constants";

import { Form, Input, Button, notification } from "antd";
const FormItem = Form.Item;

const Signup = () => {
  let history = useHistory();

  const [form, setState] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  function handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    setState({
      ...form,
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue),
      },
    });
    // console.log(form);
  }

  const onFinish = (values) => {
    const signupRequest = {
      name: form.name.value,
      email: form.email.value,
      username: form.username.value,
      password: form.password.value,
    };
    signup(signupRequest)
      .then((response) => {
        notification.success({
          message: "Viedu App",
          description:
            "Thank you! You're successfully registered. Please Login to continue!",
        });
        history.push("/login");
      })
      .catch((error) => {
        notification.error({
          message: "Viedu App",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
      });
  };

  function isFormInvalid() {
    return !(
      form.name.validateStatus === "success" &&
      form.username.validateStatus === "success" &&
      form.email.validateStatus === "success" &&
      form.password.validateStatus === "success"
    );
  }

  // Validation Functions

  const validateName = (name) => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      return {
        validateStatus: "error",
        errorMsg: "Email may not be empty",
      };
    }

    const EMAIL_REGEX = RegExp("[^@ ]+@[^@ ]+\\.[^@ ]+");
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: "error",
        errorMsg: "Email not valid",
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`,
      };
    }

    return {
      validateStatus: null,
      errorMsg: null,
    };
  };

  const validateUsername = (username) => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: null,
        errorMsg: null,
      };
    }
  };

  function validateUsernameAvailability() {
    // First check for client side errors in username
    const usernameValue = form.username.value;
    const usernameValidation = validateUsername(usernameValue);

    if (usernameValidation.validateStatus === "error") {
      setState({
        ...form,
        username: {
          value: usernameValue,
          ...usernameValidation,
        },
      });
      return;
    }

    setState({
      ...form,
      username: {
        value: usernameValue,
        validateStatus: "validating",
        errorMsg: null,
      },
    });

    checkUsernameAvailability(usernameValue)
      .then((response) => {
        if (response.available) {
          setState({
            ...form,
            username: {
              value: usernameValue,
              validateStatus: "success",
              errorMsg: null,
            },
          });
        } else {
          setState({
            ...form,
            username: {
              value: usernameValue,
              validateStatus: "error",
              errorMsg: "This username is already taken",
            },
          });
        }
      })
      .catch((error) => {
        // Marking validateStatus as success, Form will be recchecked at server
        setState({
          ...form,
          username: {
            value: usernameValue,
            validateStatus: "success",
            errorMsg: null,
          },
        });
      });
  }

  function validateEmailAvailability() {
    // First check for client side errors in email
    const emailValue = form.email.value;
    const emailValidation = validateEmail(emailValue);

    if (emailValidation.validateStatus === "error") {
      setState({
        ...form,
        email: {
          value: emailValue,
          ...emailValidation,
        },
      });
      return;
    }

    setState({
      ...form,
      email: {
        value: emailValue,
        validateStatus: "validating",
        errorMsg: null,
      },
    });

    checkEmailAvailability(emailValue)
      .then((response) => {
        if (response.available) {
          setState({
            ...form,
            email: {
              value: emailValue,
              validateStatus: "success",
              errorMsg: null,
            },
          });
        } else {
          setState({
            ...form,
            email: {
              value: emailValue,
              validateStatus: "error",
              errorMsg: "This Email is already registered",
            },
          });
        }
      })
      .catch((error) => {
        // Marking validateStatus as success, Form will be recchecked at server
        setState({
          ...form,
          email: {
            value: emailValue,
            validateStatus: "success",
            errorMsg: null,
          },
        });
      });
  }

  const validatePassword = (password) => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`,
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  return (
    <div className="signup-container">
      <h1 className="page-title">Sign Up</h1>
      <div className="signup-content">
        <Form onFinish={onFinish} className="signup-form" layout="vertical">
          <FormItem
            label="Full Name"
            validateStatus={form.name.validateStatus}
            help={form.name.errorMsg}
          >
            <Input
              size="large"
              name="name"
              autoComplete="off"
              placeholder="Your full name"
              value={form.name.value}
              onChange={(event) => handleInputChange(event, validateName)}
            />
          </FormItem>
          <FormItem
            label="Username"
            hasFeedback
            validateStatus={form.username.validateStatus}
            help={form.username.errorMsg}
          >
            <Input
              size="large"
              name="username"
              autoComplete="off"
              placeholder="A unique username"
              value={form.username.value}
              onBlur={validateUsernameAvailability}
              onChange={(event) => handleInputChange(event, validateUsername)}
            />
          </FormItem>
          <FormItem
            label="Email"
            hasFeedback
            validateStatus={form.email.validateStatus}
            help={form.email.errorMsg}
          >
            <Input
              size="large"
              name="email"
              type="email"
              autoComplete="off"
              placeholder="Your email"
              value={form.email.value}
              onBlur={validateEmailAvailability}
              onChange={(event) => handleInputChange(event, validateEmail)}
            />
          </FormItem>
          <FormItem
            label="Password"
            validateStatus={form.password.validateStatus}
            help={form.password.errorMsg}
          >
            <Input
              size="large"
              name="password"
              type="password"
              autoComplete="off"
              placeholder="A password between 6 to 20 characters"
              value={form.password.value}
              onChange={(event) => handleInputChange(event, validatePassword)}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="signup-form-button"
              disabled={isFormInvalid()}
            >
              Sign up
            </Button>
            Already registed? <Link to="/login">Login now!</Link>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};
export default Signup;
