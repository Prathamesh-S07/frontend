import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connectToTopic(topic, onMessage) {
  const sock = new SockJS("/ws-queue"); // proxy handles absolute host
  stompClient = new Client({
    webSocketFactory: () => sock,
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient.subscribe(topic, (msg) => {
        if (msg.body) {
          try {
            const payload = JSON.parse(msg.body);
            onMessage && onMessage(payload);
          } catch (e) {
            onMessage && onMessage(msg.body);
          }
        }
      });
    },
    onStompError: (err) => {
      console.error("STOMP error", err);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function disconnect() {
  if (stompClient) stompClient.deactivate();
}
