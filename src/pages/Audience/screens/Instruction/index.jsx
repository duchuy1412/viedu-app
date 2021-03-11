import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, message, Space } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { WS_BASE_URL } from "constants/index";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

Instruction.propTypes = {};

function Instruction(props) {
  const history = useHistory();
  const location = useLocation();
  const { state } = location;

  const [question, setQuestion] = useState(null);

  var stompClient = null;

  function connect() {
    let serverUrl = WS_BASE_URL;
    let ws = new SockJS(serverUrl);
    stompClient = Stomp.over(ws);

    stompClient.connect({}, onConnected, onError);
  }

  function onConnected() {
    stompClient.subscribe(`/quiz/${state.pin}`, onMessageReceived);
  }

  function onError(error) {
    message.error(
      "Could not connect to server. Please refresh this page to try again!"
    );
  }

  function onMessageReceived(payload) {
    let receivedMessage = JSON.parse(payload.body);

    if (receivedMessage.type === "SEND_QUESTION") {
      let messages = receivedMessage.content.split("|");
      // console.log(messages);

      setQuestion({
        title: messages[0],
        questionType: messages[1],
      });
    }

    if (receivedMessage.type === "SKIP") {
      setQuestion(null);
    }
  }

  useEffect(() => {
    connect();
  }, []);

  const handleInteract = (e) => {
    // console.log(e.target.value);
    const answerNum = e.target.value;
    stompClient.send(
      `/app/game.sendResponse/${state.pin}`,
      {},
      JSON.stringify({
        sender: state.nickname,
        type: "INTERACT",
        content: answerNum,
      })
    );
  };

  return (
    <div>
      {question !== null ? (
        question.questionType === "QUESTION_CHOICE_ANSWER" ? (
          <span>
            <Space>
              <Button value={0} onClick={handleInteract}>
                A
              </Button>
              <Button value={1} onClick={handleInteract}>
                B
              </Button>
              <Button value={2} onClick={handleInteract}>
                C
              </Button>
              <Button value={3} onClick={handleInteract}>
                D
              </Button>
            </Space>
          </span>
        ) : question.questionType === "QUESTION_TRUE_FALSE" ? (
          <span>
            <Space>
              <Button value={0} onClick={handleInteract}>
                True
              </Button>
              <Button value={1} onClick={handleInteract}>
                False
              </Button>
            </Space>
          </span>
        ) : (
          <span>
            <Input />
          </span>
        )
      ) : (
        <span>Looking up at the podium</span>
      )}
    </div>
  );
}

export default Instruction;
