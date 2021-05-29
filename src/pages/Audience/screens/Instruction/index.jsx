import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Input,
  message,
  Result,
  Form,
  Row,
  Col,
  Typography,
} from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { WS_BASE_URL } from "constants/index";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import moment from "moment";
import * as QuestionType from "util/QuestionType";
import Checkbox from "antd/lib/checkbox/Checkbox";
import styled from "styled-components";
import { OrderedListOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";

Instruction.propTypes = {};

const CenterDiv = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OptionBox = styled(Button)`
  flex: 1;
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  font-size: 15;
  font-weight: bold;
  padding: 10px;
  border: 1px solid black;
  border-radius: 8px;
  margin: 5px;
`;

var stompClient = null;
function Instruction(props) {
  const history = useHistory();
  const location = useLocation();
  const { state } = location;

  const [question, setQuestion] = useState(null);
  const [screen, setScreen] = useState({ name: "SC_ANSWER", info: {} }); // Screen state: SC_ANSWER, SC_WAIT, SC_RESULT

  const [optionSelected, setOptionSelected] = useState([]);

  let startTime = useRef(null);

  const onMessageReceived = useCallback((payload) => {
    let receivedMessage = JSON.parse(payload.body);

    if (receivedMessage.type === "END") {
      history.replace("/go");
    }

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
              info: { status: "0", title: "HALF TIME" },
              hidden: false,
            }
      );
    }

    if (receivedMessage.type === "SCORE_BOARD") {
      let listPlayer = JSON.parse(receivedMessage.content);
      let currentPoint = 0;

      const rank = (nickname) => {
        for (var i = 0; i < listPlayer.length; i += 1) {
          if (listPlayer[i]["nickname"] === nickname) {
            currentPoint = listPlayer[i]["point"];
            return i + 1;
          }
        }
        return -1;
      };

      setScreen((screen) => ({
        name: "SC_SCOREBOARD",
        info: {
          status: "1",
          title: "You are #" + rank(state.nickname),
          currentPoint: currentPoint,
        },
        hidden: false,
      }));
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

  const submitQuestionInput = (values) => {
    let { playerInput } = values;
    console.log(values);
    handleInteract(playerInput);
  };

  const options = question
    ? question.questionType === QuestionType.QUESTION_CHOICE_ANSWER
      ? [
          { icon: "A", color: "red" },
          { icon: "B", color: "blue" },
          { icon: "C", color: "orange" },
          { icon: "D", color: "green" },
        ]
      : [
          { icon: "A", color: "red" },
          { icon: "B", color: "blue" },
        ]
    : [];

  const buttonOptions = options.map((option, index) => (
    <Col
      span={12}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OptionBox
        style={{
          backgroundColor: option.color,
        }}
        key={index}
        value={index}
        onClick={(e) => handleInteract(e.currentTarget.value)}
      >
        {option.icon} {question.answers ? question.answers[index].text : ""}
      </OptionBox>
    </Col>
  ));

  const buttonMultiSelect = options.map((option, index) => (
    <div key={index}>
      <Checkbox value={index} onChange={onCheckboxChange}>
        {option.icon} {question.answers ? question.answers[index].text : ""}
      </Checkbox>
    </div>
  ));

  return (
    <>
      {screen.name === "SC_ANSWER" ? (
        question !== null ? (
          <div style={{ margin: 5 }}>
            <Row style={{ backgroundColor: "Background" }}>
              <Col xl={24}>
                <CenterDiv>
                  <Typography.Text strong style={{ fontSize: 25 }}>
                    {question.title ? question.title : ""}
                  </Typography.Text>
                </CenterDiv>
              </Col>
            </Row>

            {question.questionType === QuestionType.QUESTION_CHOICE_ANSWER ||
            question.questionType === QuestionType.QUESTION_TRUE_FALSE ? (
              question.multiSelect === true ? (
                <>
                  <Row>{buttonMultiSelect}</Row>
                  <Row span={24}>
                    <Button onClick={submitQuestionChoice}>Submit</Button>
                  </Row>
                </>
              ) : (
                <Row>{buttonOptions}</Row>
              )
            ) : (
              <Form onFinish={submitQuestionInput}>
                <Row>
                  <Col span={12} offset={6}>
                    <CenterDiv
                      style={{ paddingTop: "20px", paddingBottom: "20px" }}
                    >
                      <Form.Item name="playerInput">
                        <Input placeholder="Input your answer" />
                      </Form.Item>
                    </CenterDiv>
                  </Col>
                </Row>

                <Row>
                  <Col span={8} offset={8}>
                    <CenterDiv>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </CenterDiv>
                  </Col>
                </Row>
              </Form>
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
      {screen.name === "SC_SCOREBOARD" ? (
        <ResultView
          title={screen.info.title}
          icon={<OrderedListOutlined />}
          extra={<Title level={1}>{screen.info.currentPoint}</Title>}
        />
      ) : null}
      {/* <div
        style={{
          position: "fixed",
          bottom: 0,
          padding: 20,
          width: "100%",
          background: "#1890ff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
            fontWeight: "bold",
          }}
        ></div>
        <span><b>{state.nickname}</b></span>
        <span>
          {localStorage.getItem("point") ? localStorage.getItem("point") : "0"}
        </span>
      </div> */}
    </>
  );
}

function ResultView(props) {
  return (
    <>
      <Result
        {...props}
        status={
          props.status === "1"
            ? "success"
            : props.status === "0"
            ? "error"
            : "info"
        }
        title={props.title}
      ></Result>
    </>
  );
}

export default Instruction;
