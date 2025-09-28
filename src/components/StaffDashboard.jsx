import React, { useEffect, useState, useCallback } from "react";
import { fetchQueuesByCounter, markServed, fetchAssignedCounter } from "../api";
import "../styles/StaffDashboard.css";

const POLL_MS = 4000;

const StaffDashboard = () => {
  const [counter, setCounter] = useState(null);
  const [counterId, setCounterId] = useState("");
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (cid) => {
      if (!cid) return;
      setLoading(true);
      try {
        const list = await fetchQueuesByCounter(cid);
        setQueues(list || []);
      } catch (e) {
        console.error(e);
        setQueues([]);
      } finally {
        setLoading(false);
      }
    },
    [] // stable function
  );

  // Fetch assigned counter
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchAssignedCounter();
        if (mounted) {
          setCounter(data);
          setCounterId(data?.id ? String(data.id) : "");
        }
      } catch {
        if (mounted) {
          setCounter(null);
          setCounterId("");
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Poll queues
  useEffect(() => {
    if (!counterId) return;
    const interval = setInterval(() => load(counterId), POLL_MS);
    load(counterId); // initial load
    return () => clearInterval(interval);
  }, [counterId, load]);

  const onServe = async (id) => {
    try {
      await markServed(id);
      load(counterId);
    } catch (err) {
      console.error("Failed to mark served", err);
      alert("Failed to serve. Check your login or permissions.");
    }
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
                  <div>{q.userName || "-"}</div>
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
