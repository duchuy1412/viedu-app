import { Button, message, Statistic } from "antd";
import { WS_BASE_URL } from "constants/index";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getPresentation } from "util/APIUtils";

InGame.propTypes = {};

var stompClient = null;

const { Countdown } = Statistic;

function InGame(props) {
  const history = useHistory();
  const games = useSelector((state) => state.games);
  const game = games.current;
  const [presentation, setPresentation] = useState({});
  const [question, setQuestion] = useState({ data: {}, index: -1 });
  // const [isLastQuestion, setIsLastQuestion] = useState(false);

  const { presentationId } = game;

  const rendered = useRef(1);
  useEffect(() => {
    rendered.current = rendered.current + 1;
  });

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

    if (receivedMessage.type === "INTERACT") {
      console.log(receivedMessage.sender + ": " + receivedMessage.content);
    }

    if (receivedMessage.type === "SKIP") {
      // setLive(false);
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
      disconnect();
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
  }, [question]);

  const handleNext = () => {
    // console.log(questionNumber);
    // console.log(presentation);
    if (question.index < presentation.questionList.length - 1) {
      setQuestion((question) => ({
        data: presentation.questionList[question.index + 1],
        index: question.index + 1,
      }));
    } else {
      // handle End
      history.replace("/");
    }
  };

  function sendSkip() {
    stompClient.send(
      `/app/game.skipLive/${game.pin}`,
      {},
      JSON.stringify({
        sender: game.hostedBy,
        type: "SKIP",
      })
    );
  }

  async function sendQuestion() {
    let sendContent = question.data.id.concat(
      "|",
      question.data.questionType,
      "|",
      question.data.title
    );
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
      rendered : {rendered.current}
      {presentation.questionList ? (
        <>
          <div>
            <Button onClick={() => handleNext()}>
              {question.index < presentation.questionList.length - 1
                ? "Next"
                : "End"}
            </Button>
          </div>
          <Countdown
            title="Time"
            value={Date.now() + 1000 * 6}
            format="ss"
            onFinish={() => console.log("Let's interact...")}
          />
          <div>
            <span>{question.data.title ? question.data.title : ""}</span>
            <ul>
              {question.data.answers
                ? question.data.answers.map((a, index) => (
                    <li key={index}>{a.text}</li>
                  ))
                : null}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default InGame;
