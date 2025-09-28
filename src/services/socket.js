import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

/**
 * Connect to a STOMP topic with JWT header.
 * @param {string} topic - Topic to subscribe to (e.g., '/topic/user/1').
 * @param {function} onMessage - Callback for incoming messages.
 */
export function connectToTopic(topic, onMessage) {
  const BACKEND_URL =
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:8080"
      : "https://backend-hhni.onrender.com");

  const socket = new SockJS(`${BACKEND_URL}/ws-queue`);

  const token = localStorage.getItem("jwt");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log("STOMP:", str),
    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    onConnect: () => {
      console.log("Connected to STOMP topic:", topic);
      stompClient.subscribe(topic, (msg) => {
        if (!msg.body) return;
        try {
          const payload = JSON.parse(msg.body);
          onMessage && onMessage(payload);
        } catch (err) {
          console.error("Failed to parse STOMP message:", err);
          onMessage && onMessage(msg.body);
        }
      });
    },
    onStompError: (err) => {
      console.error("STOMP Error:", err);
    },
    onDisconnect: () => {
      console.log("Disconnected from STOMP");
    },
  });

  stompClient.activate();
  return stompClient;
}

/**
 * Disconnect STOMP client
 */
export function disconnect() {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
    console.log("STOMP client deactivated");
  }
}
