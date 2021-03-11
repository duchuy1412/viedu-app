import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WS_BASE_URL } from "constants/index";
import { useSelector, useDispatch } from "react-redux";
import { currentGame } from "./../../hostSlice";
import { updateGame } from "util/APIUtils";

Lobby.propTypes = {};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Lobby(props) {
  //get query params
  let query = useQuery();
  const dispatch = useDispatch();
  const games = useSelector((state) => state.games);
  const game = games.current;
  const location = useLocation();
  const history = useHistory();

  const quizId = query.get("quizId");
  var stompClient = null;

  function connect() {
    let serverUrl = WS_BASE_URL;
    let ws = new SockJS(serverUrl);
    stompClient = Stomp.over(ws);

    stompClient.connect({}, onConnected, onError);
  }

  function onConnected() {
    // update game to server
    updateGame({ ...game, gameStatus: "GOING_ON" })
      .then((res) => dispatch(currentGame(res)))
      .catch((error) => console.log(error.message));

    // Subscribe to the Game
    stompClient.subscribe(`/quiz/${game.pin}`, onMessageReceived);

    // Tell name of host person to the server
    stompClient.send(
      `/app/game.hostGame/${game.pin}`,
      {},
      JSON.stringify({
        sender: game.hostedBy,
        type: "HOST",
        content: game.title,
      })
    );
  }

  function onError(error) {
    message.error(
      "Could not connect to server. Please refresh this page to try again!"
    );
  }

  const [playersJoined, setPlayersJoined] = useState([]);

  function onMessageReceived(payload) {
    var receivedMessage = JSON.parse(payload.body);

    if (receivedMessage.type === "JOIN") {
      setPlayersJoined((playersJoined) => [
        ...playersJoined,
        {
          nickname: receivedMessage.sender,
          point: 0,
        },
      ]);
    }

    if (receivedMessage.type === "LEAVE") {
      setPlayersJoined(
        playersJoined.filter(
          (player) => player.nickname !== receivedMessage.sender
        )
      );
    }
  }

  function handleStart() {
    history.push(`${location.state.rootPath}/ingame?quizId=${quizId}`);
  }

  useEffect(() => {
    connect();

    return () => {
      if (stompClient !== null) {
        stompClient.disconnect();
      }
      updateGame({ ...game, players: playersJoined })
        .then((res) => {})
        .catch((error) => console.log(error.message));
    };
  }, []);

  return (
    <div>
      <div>
        Join at <h5>viedu.live/audience</h5> with PIN: <h1>{game.pin}</h1>
      </div>
      <Button onClick={handleStart}>Start</Button>
      <BoardName list={playersJoined} />
    </div>
  );
}

function BoardName(props) {
  const { list } = props;
  return (
    <div>
      {list
        ? list.map((player, index) => (
            <span key={index}>
              <h3>{player.nickname} </h3>
            </span>
          ))
        : null}
    </div>
  );
}

export default Lobby;
