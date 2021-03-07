import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import NotFound from "common/NotFound";
import Pin from "./screens/Pin";
import Name from "./screens/Name";
import Instruction from "./screens/Instruction";

Audience.propTypes = {};

function Audience(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.url} component={Pin} />
      <Route path={`${match.url}/name`} component={Name} />
      <Route path={`${match.url}/lobby`} component={Instruction} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default Audience;
