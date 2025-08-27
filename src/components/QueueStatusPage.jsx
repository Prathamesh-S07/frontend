import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchQueueById } from "../api";
import { connectToTopic, disconnect } from "../services/socket";
import "../styles/QueueStatusPage.css";

const POLL_MS = 4000; // simple polling

const QueueStatusPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [notify, setNotify] = useState(false);
  const timerRef = useRef(null);
  const wsRef = useRef(null);

  const load = async () => {
    setError("");
    try {
      const data = await fetchQueueById(id);
      setTicket(data);
    } catch (e) {
      setError(e.message || "Unable to load ticket status.");
    }
  };

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, POLL_MS);

    // Subscribe to user-specific topic for turn notification
    wsRef.current = connectToTopic(`/topic/user/${id}`, (msg) => {
      setNotify(true);
      // Show browser notification if supported and permission granted
      if (window.Notification && Notification.permission === "granted") {
        new Notification("Queue Update", {
          body: "It's almost your turn! Please be ready.",
        });
      } else if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Queue Update", {
              body: "It's almost your turn! Please be ready.",
            });
          }
        });
      }
    });

    return () => {
      clearInterval(timerRef.current);
      disconnect();
    };
  }, [id]);

  return (
    <div className="qs-wrap">
      <div className="qs-card">
        <h2 className="qs-title">Queue Status</h2>
        {error && <div className="qs-error">{error}</div>}
        {notify && (
          <div className="qs-notify">
            It's almost your turn! Please be ready.
          </div>
        )}
        {!ticket ? (
          <div className="qs-skeleton">Loading...</div>
        ) : (
          <div className="qs-grid">
            <div className="qs-item">
              <span className="qs-label">Ticket ID</span>
              <span className="qs-value">{ticket.id}</span>
            </div>
            <div className="qs-item">
              <span className="qs-label">Counter</span>
              <span className="qs-value">{ticket?.counter?.name || "-"}</span>
            </div>
            <div className="qs-item">
              <span className="qs-label">Position</span>
              <span className="qs-value">
                {ticket.position !== undefined ? ticket.position : "-"}
              </span>
            </div>
            <div className="qs-item">
              <span className="qs-label">Status</span>
              <span
                className={`qs-badge ${ticket.served ? "done" : "waiting"}`}
              >
                {ticket.served ? "Served" : "Waiting"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueStatusPage;
