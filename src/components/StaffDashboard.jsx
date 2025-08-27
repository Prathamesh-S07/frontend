import React, { useEffect, useMemo, useState } from "react";
import { fetchQueuesByCounter, markServed } from "../api";
import "../styles/StaffDashboard.css";

const StaffDashboard = () => {
  const [counter, setCounter] = useState(null);
  const [counterId, setCounterId] = useState("");
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);

  // No need for selectedCounter, just use counter

  const load = async (cid = counterId) => {
    if (!cid) return;
    setLoading(true);
    try {
      const list = await fetchQueuesByCounter(cid);
      setQueues(list || []);
    } catch (e) {
      setQueues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the assigned counter for this staff
    (async () => {
      try {
        const res = await fetch("/counters/assigned", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCounter(data);
          setCounterId(data?.id ? String(data.id) : "");
        } else {
          setCounter(null);
          setCounterId("");
        }
      } catch {
        setCounter(null);
        setCounterId("");
      }
    })();
  }, []);

  useEffect(() => {
    if (!counterId) return;
    load(counterId);
    const t = setInterval(() => load(counterId), 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, [counterId]);

  const onServe = async (id) => {
    await markServed(id);
    load(counterId);
  };

  return (
    <div className="staff-wrap">
      <div className="staff-card">
        <div className="staff-header">
          <h2>Staff Queue</h2>
        </div>

        {counter ? (
          <>
            <div className="staff-caption">
              Viewing queue for <strong>{counter.name}</strong>
            </div>
            <div className="staff-table">
              <div className="staff-row staff-row-head">
                <div>ID</div>
                <div>Name</div>
                <div>Joined</div>
                <div>Status</div>
                <div>Action</div>
              </div>
              {queues.map((q) => (
                <div className="staff-row" key={q.id}>
                  <div>{q.id}</div>
                  <div>{q.userName || q.name || "-"}</div>
                  <div>
                    {q.joinedAt ? new Date(q.joinedAt).toLocaleString() : "-"}
                  </div>
                  <div>
                    <span className={`staff-badge ${q.served ? "ok" : "wait"}`}>
                      {q.served ? "Served" : "Waiting"}
                    </span>
                  </div>
                  <div>
                    {!q.served && (
                      <button
                        className="staff-btn"
                        onClick={() => onServe(q.id)}
                      >
                        Serve Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="staff-caption">No counter assigned.</div>
        )}
        {loading && <div className="staff-loading">Refreshing…</div>}
      </div>
    </div>
  );
};

export default StaffDashboard;
