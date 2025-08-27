import React, { useEffect, useState } from "react";
import { joinQueue, fetchCounters } from "../api";
import { QRCodeSVG } from "qrcode.react";
import "../styles/QueueForm.css";

const QueueForm = () => {
  const [counters, setCounters] = useState([]);
  const [name, setName] = useState("");
  const [counterId, setCounterId] = useState("");
  const [ticket, setTicket] = useState(null); // { id, qrData }
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchCounters();
        setCounters(list || []);
      } catch (e) {
        setCounters([]);
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setTicket(null);
    try {
      const res = await joinQueue({ name, counterId: Number(counterId) });
      setTicket({
        id: res.id,
        qrData: `${window.location.origin}/queue-status/${res.id}`,
      });
      setName("");
      setCounterId("");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to join queue.");
    }
  };

  return (
    <div className="qform-wrap">
      <form className="qform-card" onSubmit={submit}>
        <h2 className="qform-title">Join the Queue</h2>

        <label className="qform-label">
          Your Name
          <input
            className="qform-input improved-input"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </label>

        <label className="qform-label">
          Select Counter
          <select
            className="qform-input improved-input"
            value={counterId}
            onChange={(e) => setCounterId(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Choose a counter --
            </option>
            {counters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.location ? `— ${c.location}` : ""}
              </option>
            ))}
          </select>
        </label>

        {error && <div className="qform-error">{error}</div>}

        <button className="qform-btn" type="submit">
          Get Ticket
        </button>

        {ticket && (
          <div className="qform-ticket">
            <div className="qform-ticket-left">
              <h3>Your Ticket</h3>
              <p>
                Ticket ID: <strong>{ticket.id}</strong>
              </p>
              <a className="qform-link" href={`/queue-status/${ticket.id}`}>
                View Live Status
              </a>
            </div>
            <div className="qform-ticket-right">
              <QRCodeSVG value={ticket.qrData} size={148} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default QueueForm;
