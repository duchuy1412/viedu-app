import { Layout, notification } from "antd";
import React, { useEffect, useState } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  withRouter,
} from "react-router-dom";
import AppHeader from "../common/AppHeader";
import { ACCESS_TOKEN } from "../constants";
import Profile from "../user/profile/Profile";
import Signup from "../user/signup/Signup";
import { getCurrentUser } from "../util/APIUtils";
import LoadingIndicator from "./../common/LoadingIndicator";
import NotFound from "./../common/NotFound";
import PrivateRoute from "./../common/PrivateRoute";
import Presentations from "../pages/presentation/Presentations";
import Login from "./../user/login/Login";
import "./App.css";
import PublicRoute from "../common/PublicRoute";
import Home from "../pages/landing/Home";
import Questions from "../pages/question/Questions";

const { Content } = Layout;

const App = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

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
        // console.log(response);
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
    history.push("/");

    localStorage.removeItem(ACCESS_TOKEN);

    setCurrentUser(null);
    setIsAuthenticated(false);

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
    loadCurrentUser();

    history.push("/");
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

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
            {isAuthenticated && <Redirect exact from="/" to="/presentations" />}
            <PublicRoute
              restricted={false}
              path="/"
              component={Home}
              exact
              authenticated={isAuthenticated}
            />
            <PublicRoute
              exact
              restricted={true}
              path="/login"
              authenticated={isAuthenticated}
              component={(props) =>
                !isAuthenticated ? (
                  <Login onLogin={handleLogin} {...props} />
                ) : null
              }
            />
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
            />
            {/* <PrivateRoute
              authenticated={isAuthenticated}
              path="/presentations"
              component={Presentations}
              handleLogout={handleLogout}
            />
            <PrivateRoute
              authenticated={isAuthenticated}
              path="/questions"
              component={Questions}
              handleLogout={handleLogout}
            /> */}
            <Route
              path="/presentations"
              component={Presentations}
              handleLogout={handleLogout}
            />
            <Route
              path="/questions"
              component={Questions}
              handleLogout={handleLogout}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Content>
    </Layout>
  );
};

export default withRouter(App);
