import {
  CheckOutlined,
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { Button, Col, message, Row, Tooltip, Typography } from "antd";
import { WS_BASE_URL } from "constants/index";
import Delayed from "pages/Host/Delayed";
import React, { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import styled from "styled-components";
import { getPresentation } from "util/APIUtils";
import * as QuestionType from "util/QuestionType";
import CountdownTimer from "./../../CountdownTimer";
import ProgressBar from "./../../ProgressBar";
import ScoreBoard from "../ScoreBoard";
import { currentGame, updateGameStatus } from "pages/Host/hostSlice";

const ToolBar = styled.div`
  display: flex;
  flex-direction: row-reverse;
  padding: 10px;
`;

const CenterDiv = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OptionBox = styled.div`
  height: 50px;
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

InGame.propTypes = {};

var stompClient = null;

const answerOptions = [
  { icon: "A", color: "red" },
  { icon: "B", color: "blue" },
  { icon: "C", color: "orange" },
  { icon: "D", color: "green" },
];

function InGame(props) {
  const history = useHistory();
  const games = useSelector((state) => state.games);
  const game = games.current;
  const [presentation, setPresentation] = useState({});
  const [question, setQuestion] = useState({ data: {}, index: -1 });
  const [displayResult, setDisplayResult] = useState(false);
  const [scoreBoard, setScoreBoard] = useState({ display: false, list: [] });

  const dispatch = useDispatch();
  const handle = useFullScreenHandle();

  const { presentationId } = game;

  // const rendered = useRef(1);
  // useEffect(() => {
  //   rendered.current = rendered.current + 1;
  // });
  // ];

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
    // Subscribe to the Game
    stompClient.subscribe(`/quiz/${game.pin}`, onMessageReceived);
  }

  function onError(error) {
    message.error(
      "Could not connect to server. Please refresh this page to try again!"
    );
  }

  function onMessageReceived(payload) {
    var receivedMessage = JSON.parse(payload.body);

    if (receivedMessage.type === "END") {
      dispatch(updateGameStatus({ gameStatus: "FINISHED" }));
    }

    if (receivedMessage.type === "SCORE_BOARD") {
      let listPlayer = JSON.parse(receivedMessage.content);
      setScoreBoard((scoreBoard) => ({ ...scoreBoard, list: listPlayer }));
      dispatch(currentGame({ ...game, players: listPlayer }));
    }
  }

  useEffect(() => {
    let mounted = true;
    //re-connect
    connect();

    // get list of questions
    const fetch = async () => {
      await getPresentation(presentationId)
        .then((res) => {
          if (mounted) {
            setPresentation(res);
          }
        })
        .catch((error) => console.log(error));
    };

    fetch();

    return () => {
      mounted = false;
      stompClient.send(
        `/app/game.endGame/${game.pin}`,
        {},
        JSON.stringify({
          sender: game.hostedBy,
          type: "END",
          content: "Host end game",
        })
      );
    };
  }, []);

  useEffect(() => {
    if (presentation.questionList)
      setQuestion({
        data: presentation.questionList[0],
        index: 0,
      });
    else {
      console.log("Presentation has been loaded yet");
    }
  }, [presentation]);

  useEffect(() => {
    question.index >= 0
      ? setTimeout(() => {
          // allow players to answer
          sendQuestion();
          // console.log(presentation);
          let count = question.data.seconds;
          const timeAnswer = setInterval(() => {
            console.log(count);
            if (count === 0) {
              console.log("Time up");
              clearInterval(timeAnswer);
              //skip
              sendSkip();
            }
            count--;
          }, 1000);
        }, 5000)
      : console.log("No question is loaded");

    return () => {
      setDisplayResult(false);
    };
  }, [question]);

  const handleNext = () => {
    if (!scoreBoard.display) {
      // setQuestion((question) => ({ ...question, data: {} }));

      stompClient.send(
        `/app/game.getScoreBoard/${game.pin}`,
        {},
        JSON.stringify({
          sender: game.hostedBy,
          type: "SCORE_BOARD",
          content: "Get score board",
        })
      );

      setScoreBoard((scoreBoard) => ({ ...scoreBoard, display: true }));
    } else {
      setScoreBoard((scoreBoard) => ({ ...scoreBoard, display: false }));

      if (question.index < presentation.questionList.length - 1) {
        setQuestion((question) => ({
          data: presentation.questionList[question.index + 1],
          index: question.index + 1,
        }));
      } else {
        // handle End
        history.replace("/");
      }
    }

    console.log(scoreBoard);
  };

  function sendSkip() {
    stompClient.send(
      `/app/game.skipLive/${game.pin}`,
      {},
      JSON.stringify({
        sender: game.hostedBy,
        type: "SKIP",
        content: question.data.id,
      })
    );
    setDisplayResult(true);
  }

  async function sendQuestion() {
    let sendObject = JSON.parse(JSON.stringify(question.data));

    if (sendObject.questionType === QuestionType.QUESTION_INPUT_ANSWER)
      delete sendObject.answers;
    else sendObject.answers.map((answer) => delete answer.correct);

    let sendContent = JSON.stringify(sendObject);

    stompClient.send(
      `/app/game.sendQuestion/${game.pin}`,
      {},
      JSON.stringify({
        sender: game.hostedBy,
        type: "SEND_QUESTION",
        content: sendContent,
      })
    );
  }

  return (
    <div>
      <FullScreen handle={handle}>
        <div
          style={{
            backgroundColor: "white",
            display: "flex",
            flex: 1,
            height: "100%",
            flexDirection: "column",
          }}
        >
          <ToolBar>
            {handle.active ? (
              <Tooltip placement="bottomRight" title="Exit">
                <Button
                  onClick={handle.exit}
                  icon={<FullscreenExitOutlined />}
                />
              </Tooltip>
            ) : (
              <Tooltip placement="bottomRight" title="Fullscreen">
                <Button onClick={handle.enter} icon={<FullscreenOutlined />} />
              </Tooltip>
            )}
          </ToolBar>
          {presentation.questionList ? (
            <>
              <Row style={{ backgroundColor: "Background" }}>
                <Col xl={4}>
                  <CenterDiv>
                    <Typography.Text strong style={{ fontSize: 25 }}>
                      Question {question.index + 1} of{" "}
                      {presentation.questionList.length}
                    </Typography.Text>
                  </CenterDiv>
                </Col>
                <Col xl={16}>
                  <CenterDiv>
                    <Typography.Text strong style={{ fontSize: 25 }}>
                      {scoreBoard.display === false && question.data.title
                        ? question.data.title
                        : ""}
                    </Typography.Text>
                  </CenterDiv>
                </Col>
                <Col xl={4}>
                  <CenterDiv
                    style={{ justifyContent: "flex-end", padding: 10 }}
                  >
                    <Button type="primary" onClick={() => handleNext()}>
                      {question.index < presentation.questionList.length - 1
                        ? "Next"
                        : "End"}
                    </Button>
                  </CenterDiv>
                </Col>
              </Row>
              {scoreBoard.display === true ? (
                <ScoreBoard list={scoreBoard.list}></ScoreBoard>
              ) : (
                <>
                  {question.data.id && (
                    <div>
                      <CenterDiv>
                        <ProgressBar time={5000} id={question.data.id} />
                      </CenterDiv>

                      <Delayed waitBeforeShow={5000} id={question.data.id}>
                        <Row>
                          <Col span={5}>
                            <CenterDiv>
                              <CountdownTimer
                                duration={question.data.seconds}
                              />
                            </CenterDiv>
                          </Col>
                          <Col span={14}></Col>
                          <Col span={5}></Col>
                        </Row>
                        <Row>
                          {question.data.answers &&
                          (question.data.questionType ===
                            QuestionType.QUESTION_CHOICE_ANSWER ||
                            question.data.questionType ===
                              QuestionType.QUESTION_TRUE_FALSE)
                            ? question.data.answers.map((a, index) => (
                                <Col key={index} span={12}>
                                  <OptionBox
                                    style={{
                                      justifyContent: displayResult
                                        ? "space-between"
                                        : "flex-start",
                                      backgroundColor:
                                        answerOptions[index].color,
                                      opacity: displayResult
                                        ? !a.correct
                                          ? 0.3
                                          : 1
                                        : 1,
                                    }}
                                  >
                                    <span>
                                      {answerOptions[index].icon}. {a.text}
                                    </span>
                                    {displayResult ? (
                                      <span>
                                        {a.correct ? (
                                          <CheckOutlined />
                                        ) : (
                                          <CloseOutlined />
                                        )}
                                      </span>
                                    ) : null}
                                  </OptionBox>
                                </Col>
                              ))
                            : null}
                          {question.data.answers &&
                          question.data.questionType ===
                            QuestionType.QUESTION_INPUT_ANSWER ? (
                            <>
                              {!displayResult && (
                                <div>
                                  Please input your answer in your device!
                                </div>
                              )}
                              {displayResult &&
                                question.data.answers.map((a, index) => (
                                  <Col key={index} span={12}>
                                    <OptionBox
                                      style={{
                                        justifyContent: "space-between",
                                        backgroundColor:
                                          answerOptions[index].color,
                                      }}
                                    >
                                      <span>
                                        {answerOptions[index].icon}. {a.text}
                                      </span>

                                      <span>
                                        <CheckOutlined />
                                      </span>
                                    </OptionBox>
                                  </Col>
                                ))}
                            </>
                          ) : null}
                        </Row>
                      </Delayed>
                    </div>
                  )}
                </>
              )}
            </>
          ) : null}
        </div>
      </FullScreen>
    </div>
  );
}

export default InGame;
