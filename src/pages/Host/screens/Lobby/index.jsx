import { message } from "antd";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WS_BASE_URL } from "constants/index";
import { useSelector, useDispatch } from "react-redux";
import { addGuest } from "./../../hostSlice";

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

  console.log(game);
  const quizId = query.get("quizId");

  var stompClient = null;

  function connect() {
    let serverUrl = WS_BASE_URL;
    let ws = new SockJS(serverUrl);
    stompClient = Stomp.over(ws);

    stompClient.connect({}, onConnected, onError);
  }

  function onConnected() {
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

  function sendMessage(event) {
    var messageContent = "Message " + Math.floor(Math.random() * 1000);
    if (messageContent && stompClient) {
      var chatMessage = {
        sender: "userHost",
        content: messageContent,
        type: "INTERACT",
      };
      stompClient.send(
        "/app/game.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
    }
  }

  function onMessageReceived(payload) {
    var receivedMessage = JSON.parse(payload.body);

    if (receivedMessage.type === "HOST") {
      receivedMessage.content = receivedMessage.sender + " hosted!";
    }

    if (receivedMessage.type === "JOIN") {
      let newGuest = {
        username: receivedMessage.sender,
        point: 0,
      };
      dispatch(addGuest(newGuest));
    }

    message.success(receivedMessage.content);
  }

  useEffect(() => {
    connect();
  });

  return (
    <div>
      <div>
        Join at <h5>viedu.live/audience</h5> with PIN: <h1>{game.pin}</h1>
      </div>
      <div>
        {game.guests
          ? game.guests.map((guest) => (
              <span>
                <h3>{guest.username}</h3>
                <br />
              </span>
            ))
          : null}
      </div>
    </div>
  );
}

export default Lobby;
