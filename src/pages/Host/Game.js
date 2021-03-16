import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

function Game(props) {
  var stompClient = null;

  let username = "user" + Math.floor(Math.random() * 1000);

  function connect() {
    // username = document.querySelector("#name").value.trim();

    if (username) {
      let serverUrl = "http://localhost:8080/ws";
      let ws = new SockJS(serverUrl);
      stompClient = Stomp.over(ws);

      stompClient.connect({}, onConnected, onError);
    }
  }

  function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe("/topic/public", onMessageReceived);

    // Tell your username to the server
    stompClient.send(
      "/app/game.addUser",
      {},
      JSON.stringify({ sender: username, type: "JOIN" })
    );
  }

  function onError(error) {
    message.error(
      "Could not connect to WebSocket server. Please refresh this page to try again!"
    );
  }

  function sendMessage(event) {
    var messageContent = "Message " + Math.floor(Math.random() * 1000);
    if (messageContent && stompClient) {
      var chatMessage = {
        sender: username,
        content: messageContent,
        type: "CHAT",
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

    if (receivedMessage.type === "JOIN") {
      receivedMessage.content = receivedMessage.sender + " joined!";
    } else if (receivedMessage.type === "LEAVE") {
      receivedMessage.content = receivedMessage.sender + " left!";
    } else {
    }

    message.success(receivedMessage);
  }

  return (
    <div>
      <Button onClick={() => connect()}> Join</Button>
    </div>
  );
}

export default Game;
