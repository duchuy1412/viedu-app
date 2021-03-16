import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import NotFound from "common/NotFound";
import Main from "./screens/Main";
import Lobby from "./screens/Lobby";
import InGame from "./screens/InGame";

Host.propTypes = {};

function Host(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.url} component={Main} />

      <Route path={`${match.url}/lobby`} component={Lobby} />
      <Route path={`${match.url}/ingame`} component={InGame} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default Host;
