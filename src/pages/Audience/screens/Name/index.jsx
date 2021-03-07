import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input, Button, message } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WS_BASE_URL } from "constants/index";

Name.propTypes = {};

function Name(props) {
  const history = useHistory();
  const location = useLocation();
  const { state } = location;
  console.log(history);

  const [name, setName] = useState("");

  const onChange = (value) => {
    setName(value);
  };

  const hanldeOk = () => {
    connect();
  };

  var stompClient = null;

  function connect() {
    let serverUrl = WS_BASE_URL;
    let ws = new SockJS(serverUrl);
    stompClient = Stomp.over(ws);

    stompClient.connect({}, onConnected, onError);
  }

  function onConnected() {
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
