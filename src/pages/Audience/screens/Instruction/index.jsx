import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, message, Result, Space } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { WS_BASE_URL } from "constants/index";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import moment from "moment";
import * as QuestionType from "util/QuestionType";
import Checkbox from "antd/lib/checkbox/Checkbox";

Instruction.propTypes = {};

var stompClient = null;
function Instruction(props) {
  const history = useHistory();
  const location = useLocation();
  const { state } = location;

  const [question, setQuestion] = useState(null);
  const [screen, setScreen] = useState({ name: "SC_ANSWER", info: {} }); // Screen state: SC_ANSWER, SC_WAIT, SC_RESULT

  const [optionSelected, setOptionSelected] = useState([]);

  let startTime = useRef(null);
  let inputRef = useRef(null);

  const onMessageReceived = useCallback((payload) => {
    let receivedMessage = JSON.parse(payload.body);

    if (receivedMessage.type === "SEND_QUESTION") {
      setScreen({ name: "SC_ANSWER", info: {} });

      let messages = JSON.parse(receivedMessage.content);
      setQuestion(messages);

      startTime.current = moment();
    }

    if (receivedMessage.type === "INTERACT") {
      let status = receivedMessage.content.substring(0, 1); // status: 1 => correct, 0 => incorrect
      let point = receivedMessage.content.substring(1);
      setScreen({
        name: "SC_RESULT",
        info: { status: status, title: point },
        hidden: true,
      });
    }

    if (receivedMessage.type === "SKIP") {
      setScreen((screen) =>
        screen.name === "SC_RESULT"
          ? { ...screen, hidden: false }
          : {
              name: "SC_HALFTIME",
              info: { status: 0, title: "HALF TIME" },
              hidden: false,
            }
      );
      // setScreen({
      //   name: "SC_HALFTIME",
      //   info: { status: 0, title: "HALF TIME" },
      //   hidden: false,
      // });
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

  function handleInteract(playerAnswer) {
    if (playerAnswer !== null) {
      stompClient.send(
        `/app/game.sendResponse/${state.pin}`,
        {
          questionId: question.id,
          responseTime: moment().diff(startTime.current, "seconds", true),
        },
        JSON.stringify({
          sender: state.nickname,
          type: "INTERACT",
          content: playerAnswer,
        })
      );
    }
  }

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  const onCheckboxChange = (e) => {
    if (e.target.checked === true) {
      setOptionSelected((optionSelected) => [
        ...optionSelected,
        e.target.value,
      ]);
    } else {
      setOptionSelected(
        optionSelected.filter((option) => option !== e.target.value)
      );
    }
    console.log(optionSelected);
  };

  const submitQuestionChoice = () => {
    let playerSelected = optionSelected.join(); // join array to string
    handleInteract(playerSelected);
  };

  const submitQuestionInput = () => {
    let playerInput = inputRef.current.value;
    handleInteract(playerInput);
  };

  const options = question
    ? question.questionType === QuestionType.QUESTION_CHOICE_ANSWER
      ? ["A", "B", "C", "D"]
      : ["A", "B"]
    : [];

  const buttonOptions = options.map((option, index) => (
    <Button
      key={index}
      value={index}
      onClick={(e) => handleInteract(e.currentTarget.value)}
    >
      {option} {question ? question.answers[index].text : ""}
    </Button>
  ));

  const buttonMultiSelect = options.map((option, index) => (
    <div key={index}>
      <Checkbox value={index} onChange={onCheckboxChange}>
        {option} {question ? question.answers[index].text : ""}
      </Checkbox>
    </div>
  ));

  return (
    <>
      {screen.name === "SC_ANSWER" ? (
        question !== null ? (
          <div>
            <div>{question.title}</div>
            {question.questionType === QuestionType.QUESTION_CHOICE_ANSWER ||
            question.questionType === QuestionType.QUESTION_TRUE_FALSE ? (
              question.multiSelect === true ? (
                <div>
                  <Space>{buttonMultiSelect}</Space>
                  <Button onClick={submitQuestionChoice}>Submit</Button>
                </div>
              ) : (
                <div>
                  <Space>{buttonOptions}</Space>
                </div>
              )
            ) : (
              <div>
                <Input ref={inputRef} />
                <Button onClick={submitQuestionInput}>Submit</Button>
              </div>
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
      {!screen.hidden && screen.name === "SC_RESULT" ? (
        <ResultView status={screen.info.status} title={screen.info.title} />
      ) : null}
      {screen.name === "SC_HALFTIME" ? (
        <ResultView status={screen.info.status} title={screen.info.title} />
      ) : null}
      {screen.hidden && screen.name === "SC_RESULT" ? (
        <Result status="success" title="Waiting for the result" extra={[]} />
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
