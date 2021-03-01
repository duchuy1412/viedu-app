import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({
  component: Component,
  restricted,
  authenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated && restricted ? (
        <Redirect to="/" />
      ) : (
        <Component {...rest} {...props} />
      )
    }
  />
);

export default PublicRoute;
