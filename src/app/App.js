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
import { getCurrentUser } from "../util/APIUtils";
import LoadingIndicator from "./../common/LoadingIndicator";
import NotFound from "./../common/NotFound";
import PrivateRoute from "./../common/PrivateRoute";
import "./App.css";
import PublicRoute from "../common/PublicRoute";

const { Content } = Layout;

const Home = React.lazy(() => import("pages/landing/Home"));
const Audience = React.lazy(() => import("pages/Audience/index"));
const Host = React.lazy(() => import("pages/Host/index"));

const Presentations = React.lazy(() =>
  import("pages/presentation/Presentations")
);
const Questions = React.lazy(() => import("pages/question/Questions"));

const Login = React.lazy(() => import("pages/user/login/Login"));
const Signup = React.lazy(() => import("pages/user/signup/Signup"));
const Profile = React.lazy(() => import("pages/user/profile/Profile"));

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

  // if (isLoading) {
  //   return <LoadingIndicator />;
  // }

  return (
    <Layout className="app-container">
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <>
          <AppHeader
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <Content className="app-content">
            <div className="container">
              <Switch>
                {isAuthenticated && (
                  <Redirect exact from="/" to="/presentations" />
                )}
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
                <Route exact path="/user">
                  <Redirect to="/user/profile" />
                </Route>
                <Route
                  path="/user/profile"
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
                <Route path="/play" component={Host} />
                <Route path={["/audience", "/go"]} component={Audience} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </Content>
        </>
      )}
    </Layout>
  );
};

export default withRouter(App);
