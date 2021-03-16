import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, message, Result, Space } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { WS_BASE_URL } from "constants/index";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import moment from "moment";

Instruction.propTypes = {};

var stompClient = null;
function Instruction(props) {
  const history = useHistory();
  const location = useLocation();
  const { state } = location;

  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(false);
  const [screen, setScreen] = useState({ name: "SC_ANSWER", info: {} }); // Screen state: SC_ANSWER, SC_WAIT, SC_RESULT

  let startTime = useRef(null);

  const onMessageReceived = useCallback((payload) => {
    let receivedMessage = JSON.parse(payload.body);

    if (receivedMessage.type === "SEND_QUESTION") {
      setScreen({ name: "SC_ANSWER", info: {} });

      let messages = receivedMessage.content.split("|");
      // console.log(messages);
      setSelected(false);
      setQuestion({
        id: messages[0],
        title: messages[2],
        questionType: messages[1],
      });

      startTime.current = moment();
    }

    if (receivedMessage.type === "SKIP") {
      // setSelected(true);
      // if (!selected) {
      //   setScreen({
      //     name: "SC_RESULT",
      //     info: { status: "0", title: "HALF TIME" },
      //   });
      // }
    }

    if (receivedMessage.type === "INTERACT") {
      let status = receivedMessage.content.substring(0, 1); // status: 1 => correct, 0 => incorrect
      let point = receivedMessage.content.substring(1);
      setScreen({ name: "SC_RESULT", info: { status: status, title: point } });
    }
  }, []);

  const onConnected = useCallback(() => {
    stompClient.subscribe(`/quiz/${state.pin}`, onMessageReceived);
    stompClient.subscribe(`/user/quiz/${state.pin}`, onMessageReceived);
  }, [state.pin, onMessageReceived]);

  const onError = useCallback(() => {
    message.error(
      "Could not connect to server. Please refresh this page to try again!"
    );
  }, []);

  const connect = useCallback(() => {
    let serverUrl = WS_BASE_URL;
    let ws = new SockJS(serverUrl);
    stompClient = Stomp.over(ws);

    stompClient.connect({}, onConnected, onError);
  }, [onConnected, onError]);

  function disconnect() {
    if (stompClient !== null) stompClient.disconnect();
  }

  function handleInteract(e) {
    // console.log(e.target.value);

    const answerNum = e.currentTarget.value;

    if (answerNum !== null) {
      stompClient.send(
        `/app/game.sendResponse/${state.pin}`,
        {
          questionId: question.id,
          responseTime: moment().diff(startTime.current, "seconds", true),
        },
        JSON.stringify({
          sender: state.nickname,
          type: "INTERACT",
          content: answerNum,
        })
      );

      setSelected(true);
    }
  }

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  // console.log(stompClient);

  const fourOptions = ["A", "B", "C", "D"];
  const fourButtonOptions = fourOptions.map((option, index) => (
    <Button
      key={index}
      value={index}
      onClick={(e) => handleInteract(e, "value")}
    >
      {option}
    </Button>
  ));

  const twoOptions = ["True", "False"];
  const twoButtonOptions = twoOptions.map((option, index) => (
    <Button
      key={index}
      value={index}
      onClick={(e) => handleInteract(e, "value")}
    >
      {option}
    </Button>
  ));

  return (
    <>
      {screen.name === "SC_ANSWER" ? (
        question !== null ? (
          <div>
            {!selected ? (
              question.questionType === "QUESTION_CHOICE_ANSWER" ? (
                <span>
                  <Space>{fourButtonOptions}</Space>
                </span>
              ) : question.questionType === "QUESTION_TRUE_FALSE" ? (
                <span>
                  <Space>{twoButtonOptions}</Space>
                </span>
              ) : (
                <span>
                  <Input />
                </span>
              )
            ) : (
              <Result
                status="success"
                title="Waiting for the result"
                extra={[]}
              />
            )}
          </div>
        ) : (
          <Result
            status="info"
            title="You can see your name at the podium"
            subTitle="Waiting for host to start game"
            extra={[]}
          />
        )
      ) : null}
      {screen.name === "SC_RESULT" ? (
        <ResultView status={screen.info.status} title={screen.info.title} />
      ) : null}
    </>
  );
}

function ResultView(props) {
  return (
    <>
      <Result
        status={props.status === "1" ? "success" : "error"}
        title={props.title}
      ></Result>
    </>
  );
}

export default Instruction;
