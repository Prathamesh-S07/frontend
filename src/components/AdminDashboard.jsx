import React, { useEffect, useState, useRef } from "react";
import {
  fetchAdminCounters,
  createAdminCounter,
  deleteAdminCounter,
  markServed,
  filterQueues,
  downloadQueuesExcel,
} from "../api";
import CounterList from "./CounterList";
import AddCounterForm from "./AddCounterForm";
import AdminManageRoles from "./AdminManageRoles";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [counters, setCounters] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [rolesLoading, setRolesLoading] = useState(false);

  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [filterCounter, setFilterCounter] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const isMounted = useRef(true); // for safe state updates

  // Load counters + today's queues
  const load = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
      const [cList, qList] = await Promise.all([
        fetchAdminCounters(),
        filterQueues({ startDate: today, endDate: today }), // only today's queues
      ]);
      if (isMounted.current) {
        setCounters(cList || []);
        setQueues(qList || []);
        setError("");
        // also set filterStart/End to today so date pickers show it
        setFilterStart(today);
        setFilterEnd(today);
      }
    } catch (e) {
      if (isMounted.current) {
        if (e.response?.status === 401) {
          setError("Unauthorized — please log in again.");
        } else {
          setError("Error loading data.");
        }
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // Apply filter manually
  const applyFilter = async () => {
    setLoading(true);
    try {
      const filterParams = {};
      if (filterStart) filterParams.startDate = filterStart;
      if (filterEnd) filterParams.endDate = filterEnd;

      let filtered = await filterQueues(filterParams);

      if (filterCounter) {
        filtered = filtered.filter(
          (q) => q.counter && q.counter.id === Number(filterCounter)
        );
      }
      if (filterStatus) {
        filtered = filtered.filter((q) =>
          filterStatus === "waiting" ? !q.served : q.served
        );
      }
      if (isMounted.current) {
        setQueues(filtered);
        setError("");
      }
    } catch (e) {
      if (isMounted.current) setError("Error applying filter.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // Ask for start & end at download time
  const onDownloadExcel = async () => {
    const startDate =
      prompt("Enter start date (yyyy-mm-dd):", filterStart) || "";
    const endDate = prompt("Enter end date (yyyy-mm-dd):", filterEnd) || "";
    if (!startDate || !endDate) return;

    try {
      const blob = await downloadQueuesExcel({
        startDate,
        endDate,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "queue_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      if (isMounted.current) setError("Failed to download Excel file.");
    }
  };

  useEffect(() => {
    isMounted.current = true;
    load();
    return () => {
      isMounted.current = false; // cleanup
    };
  }, []);

  const onAddCounter = async (payload) => {
    try {
      await createAdminCounter(payload);
      if (isMounted.current) {
        setMsg("Counter created");
        load();
      }
    } catch (e) {
      if (isMounted.current) setError("Failed to create counter.");
    }
  };

  const onDeleteCounter = async (id) => {
    try {
      await deleteAdminCounter(id);
      if (isMounted.current) {
        setMsg("Counter deleted");
        load();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const onServe = async (id) => {
    try {
      await markServed(id);
      if (isMounted.current) {
        setMsg(`Ticket ${id} marked as served`);
        load();
      }
    } catch (e) {
      if (isMounted.current) setError("Failed to update ticket status.");
    }
  };

  const refreshRoles = async () => {
    if (!isMounted.current) return;
    setRolesLoading(true);
    setTimeout(() => {
      if (isMounted.current) setRolesLoading(false);
    }, 1000);
  };

  return (
    <div className="admin-wrap">
      <div className="admin-top-grid">
        <section className="admin-card admin-left">
          <div className="admin-header">
            <h2>Counters</h2>
          </div>
          <div className="admin-add-counter-form-wrap">
            <AddCounterForm onCreate={onAddCounter} />
          </div>
          <CounterList
            counters={counters}
            onDelete={onDeleteCounter}
            onStaffAssigned={load}
          />
        </section>
        <section className="admin-card admin-right">
          <AdminManageRoles loading={rolesLoading} onRefresh={refreshRoles} />
        </section>
      </div>

      <section className="admin-card admin-queues">
        <div className="admin-header">
          <h2>All Queues</h2>
          {!loading && (
            <button
              className="admin-btn"
              style={{ marginLeft: 12 }}
              onClick={load}
            >
              Refresh
            </button>
          )}
          {loading && <span className="admin-pill">Refreshing…</span>}
        </div>

        <div className="admin-filter-bar">
          <label>
            Start Date:
            <input
              type="date"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
            />
          </label>
          <label>
            Counter:
            <select
              value={filterCounter}
              onChange={(e) => setFilterCounter(e.target.value)}
            >
              <option value="">All</option>
              {counters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status:
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="waiting">Waiting</option>
              <option value="served">Served</option>
            </select>
          </label>
          <button
            className="admin-btn"
            onClick={applyFilter}
            style={{ marginLeft: 8 }}
          >
            Apply Filter
          </button>
          <button
            className="admin-btn"
            onClick={onDownloadExcel}
            style={{ marginLeft: 8 }}
          >
            Download as Excel
          </button>
        </div>

        {error && <div className="admin-toast error">{error}</div>}

        <div className="admin-table">
          <div className="admin-row admin-row-head">
            <div>ID</div>
            <div>Name</div>
            <div>Counter</div>
            <div>Joined</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {queues.map((q) => (
            <div className="admin-row" key={q.id}>
              <div>{q.id}</div>
              <div>{q.userName || "-"}</div>
              <div>{q?.counter?.name || "-"}</div>
              <div>
                {q.joinedAt ? new Date(q.joinedAt).toLocaleString() : "-"}
              </div>
              <div>
                <span className={`admin-badge ${q.served ? "ok" : "wait"}`}>
                  {q.served ? "Served" : "Waiting"}
                </span>
              </div>
              <div>
                {!q.served && (
                  <button className="admin-btn" onClick={() => onServe(q.id)}>
                    Mark Served
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {msg && <div className="admin-toast">{msg}</div>}
    </div>
  );
};

export default AdminDashboard;
