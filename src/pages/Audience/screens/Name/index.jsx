import { Button, Input, message } from "antd";
import { WS_BASE_URL } from "constants/index";
import React, { useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

Name.propTypes = {};

function Name(props) {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const { state } = location;

  const [name, setName] = useState("");

  const onChange = (e) => {
    setName(e.target.value);
  };

  const hanldeOk = () => {
    connect();

    history.push(`${match.url}/lobby`);
  };

  var stompClient = null;

  function connect() {
    let serverUrl = WS_BASE_URL;
    let ws = new SockJS(serverUrl);
    stompClient = Stomp.over(ws);

    stompClient.connect({}, onConnected, onError);
  }

  function onConnected() {
    stompClient.subscribe(`/quiz/${state.pin}`, onMessageReceived);

    // Tell name of client to the server
    stompClient.send(
      `/app/game.addUser/${state.pin}`,
      {},
      JSON.stringify({
        sender: name,
        type: "JOIN",
        content: "",
      })
    );
  }

  function onError(error) {
    message.error(
      "Could not connect to server. Please refresh this page to try again!"
    );
  }

  function onMessageReceived(payload) {}

  return (
    <div>
      <Input
        placeholder="Enter a nick name"
        maxLength={6}
        onChange={onChange}
      />
      <Button type="primary" onClick={hanldeOk}>
        Ok
      </Button>
    </div>
  );
}

export default Name;
