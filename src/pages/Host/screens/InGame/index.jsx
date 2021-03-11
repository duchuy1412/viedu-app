import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getPresentation } from "util/APIUtils";
import { Button, message, Statistic } from "antd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WS_BASE_URL } from "constants/index";
import { useHistory } from "react-router-dom";

InGame.propTypes = {};

var stompClient = null;

const { Countdown } = Statistic;

function InGame(props) {
  const history = useHistory();
  const games = useSelector((state) => state.games);
  const game = games.current;
  const [presentation, setPresentation] = useState({});
  const [question, setQuestion] = useState(0);
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  const { presentationId } = game;

  function connect() {
    let serverUrl = WS_BASE_URL;
    let ws = new SockJS(serverUrl);
    stompClient = Stomp.over(ws);

    stompClient.connect({}, onConnected, onError);
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
    //re-connect
    connect();

    // get list of questions
    const fetch = async () => {
      await getPresentation(presentationId)
        .then((res) => setPresentation(res))
        .catch((error) => console.log(error));
    };

    fetch();
  }, []);

  useEffect(() => {
    presentation.questionList
      ? setTimeout(() => {
          // allow players to answer
          sendQuestion();
          // console.log(presentation);
          let count = presentation.questionList[question].seconds;
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
  });

  const handleNext = () => {
    if (question < presentation.questionList.length - 1) {
      if (question + 1 === presentation.questionList.length - 1) {
        setQuestion(question + 1);
        setIsLastQuestion(true);
      }
    } else {
      // handle End
      history.replace("/");
    }
    // display question to screen of other players
  };

  function sendSkip() {
    stompClient.send(
      `/app/game.sendResponse/${game.pin}`,
      {},
      JSON.stringify({
        sender: game.hostedBy,
        type: "SKIP",
      })
    );
  }

  async function sendQuestion() {
    stompClient.send(
      `/app/game.sendResponse/${game.pin}`,
      {},
      JSON.stringify({
        sender: game.hostedBy,
        type: "SEND_QUESTION",
        content:
          presentation.questionList[question].title +
          "|" +
          presentation.questionList[question].questionType,
      })
    );
  }

  return (
    <div>
      <div>
        <Button onClick={() => handleNext()}>
          {!isLastQuestion ? "Next" : "End"}
        </Button>
      </div>
      <Countdown
        title="Time"
        value={Date.now() + 1000 * 6}
        format="ss"
        onFinish={console.log("Let's interact...")}
      />
      {presentation.questionList ? (
        <div>
          <span>{presentation.questionList[question].title}</span>
          <ul>
            {presentation.questionList[question].answers.map((a, index) => (
              <li>{a.text}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default InGame;
