import { Button, message, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WS_BASE_URL } from "constants/index";
import { useSelector, useDispatch } from "react-redux";
import { currentGame } from "./../../hostSlice";
import { updateGame } from "util/APIUtils";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  SoundOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { getAvatarColor } from "util/Colors";
import useSound from "use-sound";

import bgfx from "assets/sounds/BeLikeAChild.mp3";

const ToolBar = styled.div`
  display: flex;
  flex-direction: row-reverse;
  padding: 10px;
`;

const ColorBox = styled.div`
  font-size: 1.5em;
  background: ${(props) => props.color || "dodgerblue"};
  box-shadow: dodgerblue 0px 8px 24px;
  padding: 5px;
  border-radius: 5px;
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

  const [play, { sound, stop, isPlaying }] = useSound(bgfx, {
    loop: true,
  });

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

  useEffect(() => {
    setTimeout(() => {
      play(); // play music
    }, 1000);

    return () => {
      stop(); // stop music
    };
  }, [play]);

  return (
    <div style={{ minHeight: "100vh" }}>
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
            <Space>
              <Tooltip placement="bottomRight" title="Music">
                <Button
                  type={isPlaying ? "primary" : "default"}
                  onClick={isPlaying ? () => stop() : play}
                  icon={<SoundOutlined />}
                />
              </Tooltip>

              {handle.active ? (
                <Tooltip placement="bottomRight" title="Exit">
                  <Button
                    onClick={handle.exit}
                    icon={<FullscreenExitOutlined />}
                  />
                </Tooltip>
              ) : (
                <Tooltip placement="bottomRight" title="Fullscreen">
                  <Button
                    onClick={handle.enter}
                    icon={<FullscreenOutlined />}
                  />
                </Tooltip>
              )}
            </Space>
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
            <ColorBox>
              Join at <b>www.viedu.tech/go</b> with PIN: <h1>{game.pin}</h1>
            </ColorBox>
            <ColorBox>
              <UserOutlined />
              <span style={{ margin: 5, fontWeight: "bold" }}>
                {playersJoined.length}
              </span>
            </ColorBox>
          </div>
          <div
            style={{
              margin: 30,
              display: "flex",
              flexDirection: "row",
              padding: 10,
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {list ? (
        list.length > 0 ? (
          list.reverse().map((player, index) => (
            <span style={{ fontSize: 20 }} key={index}>
              <h3
                style={{
                  paddingLeft: 8,
                  paddingRight: 8,
                  borderRadius: 8,
                  color: "white",
                  background: getAvatarColor(player.nickname),
                  opacity: 0.3,
                  width: "fit-content",
                }}
              >
                {player.nickname}
              </h3>
            </span>
          ))
        ) : (
          <span style={{ fontSize: 20 }}>
            <h3
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 8,
                color: "white",
                background: "grey",
                opacity: 0.3,
                width: "fit-content",
              }}
            >
              Waiting for players...
            </h3>
          </span>
        )
      ) : null}
    </div>
  );
}

export default Lobby;
