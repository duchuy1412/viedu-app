import { Button, message, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WS_BASE_URL } from "constants/index";
import { useSelector, useDispatch } from "react-redux";
import { currentGame } from "./../../hostSlice";
import { updateGame } from "util/APIUtils";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import styled from "styled-components";

const ToolBar = styled.div`
  display: flex;
  flex-direction: row-reverse;
  padding: 10px;
`;

Lobby.propTypes = {};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Lobby(props) {
  //get query params
  let query = useQuery();
  const quizId = query.get("quizId");

  const dispatch = useDispatch();
  const games = useSelector((state) => state.games);
  const game = games.current;

  const location = useLocation();
  const history = useHistory();

  const handle = useFullScreenHandle();

  const [playersJoined, setPlayersJoined] = useState([]);

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
      // updateGame({ ...game, players: playersJoined })
      //   .then((res) => {})
      //   .catch((error) => console.log(error.message));
    };
  }, []);

  return (
    <div>
      <FullScreen handle={handle}>
        <div
          style={{
            display: "flex",
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 20,
            }}
          >
            <Button type="primary" onClick={handleStart}>
              Start
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <span>
              Join at <b>viedu.live/audience</b> with PIN: <h1>{game.pin}</h1>
            </span>
            <div>
              Number of players: <h1>{playersJoined.length}</h1>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BoardName list={playersJoined} />
          </div>
        </div>
      </FullScreen>
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
