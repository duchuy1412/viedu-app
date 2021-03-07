import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import PropTypes from "prop-types";
import InputPIN from "pages/Audience/components/InputPIN";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WS_BASE_URL } from "constants/index";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";

Pin.propTypes = {};

function Pin(props) {
  const [pin, setPin] = useState("");
  const history = useHistory();
  const match = useRouteMatch();
  // const location = useLocation();

  const hanldeJoin = () => {
    // console.log();
    connect();
  };

  const onChange = (value) => {
    setPin(value);
  };

  var stompClient = null;

  function connect() {
    let serverUrl = WS_BASE_URL;
    let ws = new SockJS(serverUrl);
    stompClient = Stomp.over(ws);

    stompClient.connect({}, onConnected, onError);
  }

  function onConnected() {
    // Subscribe to the Game
    stompClient.subscribe(`/quiz/${pin}`, onMessageReceived);

    history.push(`${match.url}/name`, { pin: pin });
  }

  function onError(error) {
    message.error(
      "Could not connect to server. Please refresh this page to try again!"
    );
  }

  function onMessageReceived(payload) {}

  return (
    <div>
      <InputPIN
        value={pin}
        placeholder="Enter a PIN"
        onChange={onChange}
        maxLength={6}
      />
      <Button type="primary" onClick={hanldeJoin}>
        Join
      </Button>
    </div>
  );
}

export default Pin;
