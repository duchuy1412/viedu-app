import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col, message, Typography } from "antd";
import { WS_BASE_URL } from "constants/index";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import styled from "styled-components";

AnswerdCount.propTypes = {};

var stompClient = null;

const { Title } = Typography;

const CenterDiv = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function AnswerdCount(props) {
  const { game } = props;
  const [answerdCount, setAnswerdCount] = useState(0);

  function connect() {
    let serverUrl = WS_BASE_URL;
    let ws = new SockJS(serverUrl);
    stompClient = Stomp.over(ws);

    stompClient.connect({}, onConnected, onError);
  }

  function disconnect() {
    if (stompClient !== null) stompClient.disconnect();
  }

  function onConnected() {
    stompClient.subscribe(`/quiz/${game.pin}/hostListener`, onMessageReceived);
  }

  function onError(error) {
    message.error(
      "Could not connect to server. Please refresh this page to try again!"
    );
  }

  function onMessageReceived(payload) {
    var receivedMessage = JSON.parse(payload.body);

    if (receivedMessage.type === "INTERACT") {
      setAnswerdCount((answerdCount) => answerdCount + 1);
    }
  }

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return (
    <div>
      <Row>
        <Col span={24}>
          <CenterDiv>
            <Title level={4}>Answered</Title>
          </CenterDiv>
        </Col>
        <Col span={24}>
          <CenterDiv>
            <Title level={2}>{answerdCount}</Title>
          </CenterDiv>
        </Col>
      </Row>
    </div>
  );
}

export default AnswerdCount;
