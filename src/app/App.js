import { Layout, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import AppHeader from "../common/AppHeader";
import { ACCESS_TOKEN } from "../constants";
import Profile from "../user/profile/Profile";
import Signup from "../user/signup/Signup";
import { getCurrentUser } from "../util/APIUtils";
import Board from "./../Board";
import LoadingIndicator from "./../common/LoadingIndicator";
import NotFound from "./../common/NotFound";
import PrivateRoute from "./../common/PrivateRoute";
import Login from "./../user/login/Login";
import "./App.css";

const { Content } = Layout;

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  notification.config({
    placement: "topRight",
    top: 70,
    duration: 3,
  });

  function loadCurrentUser() {
    setIsLoading(true);
    getCurrentUser()
      .then((response) => {
        setCurrentUser(response);
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function handleLogout(
    redirectTo = "/",
    notificationType = "success",
    description = "You're successfully logged out."
  ) {
    localStorage.removeItem(ACCESS_TOKEN);

    setCurrentUser(null);
    setIsAuthenticated(false);

    <Redirect to={redirectTo} />;

    notification[notificationType]({
      message: "Viedu App",
      description: description,
    });
  }

  function handleLogin() {
    notification.success({
      message: "Viedu App",
      description: "You're successfully logged in.",
    });
    // loadCurrentUser();
    <Redirect to="/" />;
  }

  useEffect(() => {
    // loadCurrentUser();
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Layout className="app-container">
      <AppHeader
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <Content className="app-content">
        <div className="container">
          <Switch>
            <Route exact path="/" render={() => <Board />}></Route>
            <Route
              exact
              path="/login"
              render={(props) => <Login onLogin={handleLogin} {...props} />}
            ></Route>
            <Route exac path="/signup" component={Signup}></Route>
            <Route
              path="/users/:username"
              render={(props) => (
                <Profile
                  isAuthenticated={isAuthenticated}
                  currentUser={currentUser}
                  {...props}
                />
              )}
            ></Route>
            <PrivateRoute
              authenticated={isAuthenticated}
              path="/poll/new"
              component={null}
              handleLogout={handleLogout}
            ></PrivateRoute>
            <Route component={NotFound}></Route>
          </Switch>
        </div>
      </Content>
    </Layout>
  );
};

export default withRouter(App);
